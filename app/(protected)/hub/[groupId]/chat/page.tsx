"use client";

// React
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { Icon, Avatar, Badge, Button } from "@/components/ui";
import { useChatStore } from "@/store/chat.store";
import { cn } from "@/lib/utils/cn";
import { showSuccess, showInfo, showWarning } from "@/lib/utils/toast";
import type { ChatMessage, ContextMenuPosition, MentionOption } from "@/features/chat/types";


// Constants
const MAX_MESSAGE_LENGTH = 2000;
const CURRENT_USER_ID = "user-jeremy";
const CURRENT_USER_NAME = "Jeremy Alpha";

// Markdown rendering helper

/**
 * Renders basic markdown to HTML-safe JSX string.
 * @param text - Raw markdown text
 * @returns Rendered HTML string
 */
function renderMarkdown(text: string): string {
	let html = text;

	// Code blocks
	html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_match, _lang, code) => {
		return `<pre class="my-2 overflow-x-auto rounded-lg bg-gray-100 p-3 text-sm dark:bg-gray-700"><code>${code.trim()}</code></pre>`;
	});

	// Inline code
	html = html.replace(
		/`([^`]+)`/g,
		'<code class="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-pink-600 dark:bg-gray-700 dark:text-pink-400">$1</code>',
	);

	// Bold
	html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>');

	// Italic
	html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");

	// Mentions
	html = html.replace(
		/@(tous|Legacy|Executive|Momentum|Jeremy Alpha|Marsha)/g,
		'<span class="rounded bg-primary-100 px-1 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 font-medium">@$1</span>',
	);

	// Process line by line for block elements
	const lines = html.split("\n");
	const processedLines: string[] = [];
	let inList = false;

	for (const line of lines) {
		// Blockquote (> ...)
		if (line.startsWith("&gt; ") || line.startsWith("> ")) {
			const content = line.replace(/^(&gt; |> )/, "");
			processedLines.push(
				`<blockquote class="border-l-3 border-primary-400 pl-3 text-gray-500 dark:text-gray-400 italic my-1">${content}</blockquote>`,
			);
			continue;
		}

		// Unordered list
		if (line.startsWith("- ")) {
			if (!inList) {
				processedLines.push('<ul class="list-disc pl-5 space-y-0.5 my-1">');
				inList = true;
			}
			processedLines.push(`<li>${line.slice(2)}</li>`);
			continue;
		}

		// Ordered list
		if (/^\d+\.\s/.test(line)) {
			if (!inList) {
				processedLines.push('<ol class="list-decimal pl-5 space-y-0.5 my-1">');
				inList = true;
			}
			processedLines.push(`<li>${line.replace(/^\d+\.\s/, "")}</li>`);
			continue;
		}

		// Close list if we were in one
		if (inList) {
			// Detect if it was ol or ul by checking last opened tag
			const lastListOpen = processedLines.findLast((l) => l.startsWith("<ul") || l.startsWith("<ol"));
			processedLines.push(lastListOpen?.startsWith("<ol") ? "</ol>" : "</ul>");
			inList = false;
		}

		processedLines.push(line);
	}

	// Close list at end if still open
	if (inList) {
		const lastListOpen = processedLines.findLast((l) => l.startsWith("<ul") || l.startsWith("<ol"));
		processedLines.push(lastListOpen?.startsWith("<ol") ? "</ol>" : "</ul>");
	}

	return processedLines.join("\n");
}

/**
 * Formats an ISO timestamp to a human-readable time string.
 * @param timestamp - ISO date string
 * @returns Formatted time string (e.g., "14:32")
 */
function formatTime(timestamp: string): string {
	try {
		const date = new Date(timestamp);
		return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
	} catch {
		return "";
	}
}

// Context Menu Component

interface ContextMenuProps {
	position: ContextMenuPosition;
	onClose: () => void;
	onAction: (action: string, messageId: string) => void;
}

/**
 * Custom right-click context menu for chat messages.
 * @param {ContextMenuProps} props - Component props
 * @returns {JSX.Element} Context menu overlay
 */
function ChatContextMenu({ position, onClose, onAction }: ContextMenuProps) {
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
		};
		const escHandler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("mousedown", handler);
		document.addEventListener("keydown", escHandler);
		return () => {
			document.removeEventListener("mousedown", handler);
			document.removeEventListener("keydown", escHandler);
		};
	}, [onClose]);

	const menuItems = [
		{
			category: "Message",
			items: [
				{ id: "edit", label: "Modifier", icon: "edit" as const, ownOnly: true },
				{ id: "delete", label: "Supprimer", icon: "delete" as const, ownOnly: true },
				{ id: "copy", label: "Copier le message", icon: "document" as const, ownOnly: false },
			],
		},
		{
			category: "Organisation",
			items: [
				{ id: "pin", label: "Épingler le message", icon: "flag" as const, ownOnly: false },
				{ id: "save", label: "Enregistrer pour plus tard", icon: "star" as const, ownOnly: false },
				{ id: "unread", label: "Marquer comme non lu", icon: "eye" as const, ownOnly: false },
			],
		},
		{
			category: "Réaction",
			items: [{ id: "react", label: "Ajouter une réaction", icon: "heart" as const, ownOnly: false }],
		},
	];

	return (
		<div className="fixed inset-0 z-50" onContextMenu={(e) => e.preventDefault()}>
			<div
				ref={menuRef}
				className="animate-scale-in absolute z-50 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
				style={{ top: position.y, left: position.x }}
			>
				{menuItems.map((section, sIdx) => (
					<div key={section.category}>
						{sIdx > 0 && <div className="mx-2 h-px bg-gray-100 dark:bg-gray-700" />}
						<div className="px-3 pt-2 pb-1">
							<span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
								{section.category}
							</span>
						</div>
						<div className="px-1 pb-1">
							{section.items.map((item) => {
								if (item.ownOnly && !position.isOwnMessage) return null;
								return (
									<button
										key={item.id}
										onClick={() => {
											onAction(item.id, position.messageId);
											onClose();
										}}
										className={cn(
											"flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-colors",
											item.id === "delete"
												? "text-error-600 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-900/20"
												: "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
										)}
									>
										<Icon name={item.icon} size="sm" />
										{item.label}
									</button>
								);
							})}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// Mention Dropdown Component

interface MentionDropdownProps {
	options: MentionOption[];
	query: string;
	onSelect: (option: MentionOption) => void;
	onClose: () => void;
}

/**
 * Dropdown that shows mentionable users and groups.
 * @param {MentionDropdownProps} props - Component props
 * @returns {JSX.Element} Mention autocomplete dropdown
 */
function MentionDropdown({ options, query, onSelect, onClose }: MentionDropdownProps) {
	const filtered = useMemo(() => {
		if (!query) return options;
		return options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));
	}, [options, query]);

	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [onClose]);

	if (filtered.length === 0) return null;

	return (
		<div
			ref={menuRef}
			className="absolute bottom-full left-0 z-40 mb-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
		>
			<div className="px-3 py-2">
				<span className="text-xs font-semibold text-gray-400 dark:text-gray-500">Mentionner</span>
			</div>
			<div className="max-h-48 overflow-y-auto px-1 pb-1">
				{filtered.map((option) => (
					<button
						key={option.id}
						onClick={() => onSelect(option)}
						className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						<Icon
							name={option.type === "group" ? "users" : "profile"}
							size="sm"
							className="text-gray-400"
						/>
						<div className="flex flex-col items-start">
							<span className="font-medium text-gray-700 dark:text-gray-200">{option.label}</span>
							{option.description && (
								<span className="text-xs text-gray-400 dark:text-gray-500">{option.description}</span>
							)}
						</div>
					</button>
				))}
			</div>
		</div>
	);
}

// Markdown Toolbar Component
interface MarkdownToolbarProps {
	onInsert: (before: string, after: string) => void;
}

/**
 * Toolbar buttons for formatting markdown in the message input.
 * @param {MarkdownToolbarProps} props - Component props
 * @returns {JSX.Element} Formatting toolbar
 */
function MarkdownToolbar({ onInsert }: MarkdownToolbarProps) {
	const tools = [
		{ label: "B", title: "Gras", before: "**", after: "**" },
		{ label: "I", title: "Italique", before: "*", after: "*" },
		{ label: "<>", title: "Code", before: "`", after: "`" },
		{ label: "Lien", title: "Lien", before: "[", after: "](url)" },
		{ label: "Liste", title: "Liste", before: "- ", after: "" },
		{ label: "Citation", title: "Citation", before: "> ", after: "" },
	];

	return (
		<div className="flex items-center gap-0.5">
			{tools.map((tool) => (
				<button
					key={tool.label}
					type="button"
					title={tool.title}
					onClick={() => onInsert(tool.before, tool.after)}
					className="rounded px-1.5 py-0.5 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
				>
					{tool.label}
				</button>
			))}
		</div>
	);
}

// Single Message Component
interface MessageBubbleProps {
	message: ChatMessage;
	onContextMenu: (e: React.MouseEvent, messageId: string) => void;
}

/**
 * Renders a single chat message bubble with avatar, author, content, and attachments.
 * @param {MessageBubbleProps} props - Component props
 * @returns {JSX.Element} Message bubble
 */
function MessageBubble({ message, onContextMenu }: MessageBubbleProps) {
	const roleStyles = {
		owner: {
			nameClass: "text-amber-600 dark:text-amber-400",
			crownIcon: true,
		},
		admin: {
			nameClass: "text-purple-600 dark:text-purple-400",
			crownIcon: false,
		},
		collaborator: {
			nameClass: "text-gray-700 dark:text-gray-300",
			crownIcon: false,
		},
		bot: {
			nameClass: "text-gray-700 dark:text-gray-300",
			crownIcon: false,
		},
	};

	const style = roleStyles[message.authorRole] || roleStyles.collaborator;

	return (
		<div
			className="group flex gap-3 px-4 py-1.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
			onContextMenu={(e) => {
				e.preventDefault();
				onContextMenu(e, message.id);
			}}
		>
			{/* Avatar */}
			<div className="mt-0.5 flex-shrink-0">
				<Avatar name={message.authorName} src={message.authorAvatar} size="sm" />
			</div>

			{/* Content */}
			<div className="min-w-0 flex-1">
				{/* Author + timestamp */}
				<div className="mb-0.5 flex items-center gap-2">
					<span className={cn("text-sm font-semibold", style.nameClass)}>{message.authorName}</span>
					{style.crownIcon && (
						<svg className="h-3.5 w-3.5 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
							<path d="M2.5 19h19v2h-19v-2zm19.57-9.36c-.21-.8-1.04-1.28-1.84-1.06L14.97 10l-2.78-6.97a1.5 1.5 0 0 0-2.79-.02L6.64 10l-5.26-1.42c-.8-.22-1.63.26-1.84 1.06-.22.8.26 1.64 1.06 1.84L5.5 13l1.5 4h10l1.5-4 4.9-1.52c.8-.2 1.28-1.04 1.07-1.84z" />
						</svg>
					)}
					{message.authorRole === "admin" && (
						<span className="rounded bg-purple-100 px-1 py-0.5 text-[10px] font-semibold text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
							ADMIN
						</span>
					)}
					<span className="text-xs text-gray-400 dark:text-gray-500">{formatTime(message.timestamp)}</span>
					{message.editedAt && (
						<span className="text-xs text-gray-400 italic dark:text-gray-500">(modifié)</span>
					)}
					{message.isPinned && <Icon name="flag" size="xs" className="text-amber-500" />}
				</div>

				{/* Message content */}
				<div
					className="prose prose-sm max-w-none text-sm text-gray-700 dark:text-gray-300 [&>pre]:my-2"
					dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
				/>

				{/* File attachments */}
				{message.attachments && message.attachments.length > 0 && (
					<div className="mt-2 space-y-1.5">
						{message.attachments.map((att) => (
							<div
								key={att.id}
								className="inline-flex items-center gap-2.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800/60"
							>
								<Icon
									name={att.type === "image" ? "eye" : "document"}
									size="sm"
									className="text-gray-400"
								/>
								<div className="flex flex-col">
									<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
										{att.filename}
									</span>
									<span className="text-xs text-gray-400">{att.size}</span>
								</div>
								<button
									className="ml-2 rounded p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
									title="Télécharger"
								>
									<Icon name="download" size="sm" />
								</button>
							</div>
						))}
					</div>
				)}

				{/* Reactions */}
				{message.reactions && message.reactions.length > 0 && (
					<div className="mt-1.5 flex flex-wrap gap-1">
						{message.reactions.map((reaction, idx) => (
							<button
								key={idx}
								className={cn(
									"inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors",
									reaction.hasReacted
										? "border-primary-300 bg-primary-50 text-primary-700 dark:border-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
										: "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-600",
								)}
							>
								<span>{reaction.emoji}</span>
								<span className="font-medium">{reaction.count}</span>
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

/**
 * Full chat interface with sidebar, messages, and input area.
 * @returns {JSX.Element} Chat page
 */
export default function ChatPage() {
	// Router
	const params = useParams();
	const groupId = (params.groupId as string) || "default";

	// Store
	const activeChannel = useChatStore((s) => s.activeChannel);
	const channels = useChatStore((s) => s.channels);
	const messages = useChatStore((s) => s.messages);
	const directMessages = useChatStore((s) => s.directMessages);
	const privateGroups = useChatStore((s) => s.privateGroups);
	const mentionOptions = useChatStore((s) => s.mentionOptions);
	const setActiveChannel = useChatStore((s) => s.setActiveChannel);
	const addMessage = useChatStore((s) => s.addMessage);
	const editMessage = useChatStore((s) => s.editMessage);
	const deleteMessage = useChatStore((s) => s.deleteMessage);
	const togglePinMessage = useChatStore((s) => s.togglePinMessage);

	// Local state
	const [messageInput, setMessageInput] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);
	const [showMentions, setShowMentions] = useState(false);
	const [mentionQuery, setMentionQuery] = useState("");
	const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
	const [sidebarSearch, setSidebarSearch] = useState("");

	// Refs
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Computed
	const activeMessages = messages[activeChannel] || [];
	const activeChannelInfo = channels.find((c) => c.id === activeChannel);

	// Sidebar display name for DMs and private groups
	const activeName = useMemo(() => {
		if (activeChannelInfo) return activeChannelInfo.name;
		const dm = directMessages.find((d) => d.id === activeChannel);
		if (dm) return dm.userName;
		const pg = privateGroups.find((g) => g.id === activeChannel);
		if (pg) return pg.name;
		return "Chat";
	}, [activeChannel, activeChannelInfo, directMessages, privateGroups]);

	const activeMemberCount = useMemo(() => {
		if (activeChannelInfo) return activeChannelInfo.members.length;
		const pg = privateGroups.find((g) => g.id === activeChannel);
		if (pg) return pg.members.length;
		return 1;
	}, [activeChannel, activeChannelInfo, privateGroups]);

	// Scroll to bottom on new messages
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [activeMessages.length, activeChannel]);

	// Auto-resize textarea
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
		}
	}, [messageInput]);

	/**
	 * Sends the current message input to the active channel.
	 * @returns {void}
	 */

	const handleSendMessage = useCallback(() => {
		const content = messageInput.trim();
		if (!content) return;
		if (content.length > MAX_MESSAGE_LENGTH) {
			showWarning("Le message dépasse la limite de 2000 caractères.");
			return;
		}

		if (editingMessageId) {
			editMessage(activeChannel, editingMessageId, content);
			setEditingMessageId(null);
			showSuccess("Message modifié.");
		} else {
			const newMessage: ChatMessage = {
				id: `msg-${Date.now()}`,
				channelId: activeChannel,
				authorId: CURRENT_USER_ID,
				authorName: CURRENT_USER_NAME,
				authorRole: "owner",
				authorAvatar: "/avatar/Alpha.jpeg",
				content,
				timestamp: new Date().toISOString(),
				mentions: content.match(/@\w+/g) || undefined,
			};
			addMessage(activeChannel, newMessage);
		}

		setMessageInput("");
		setShowMentions(false);
	}, [messageInput, activeChannel, editingMessageId, addMessage, editMessage]);

	/**
	 * Handles keyboard events in the textarea (Enter to send, @ for mentions).
	 * @param e - Keyboard event
	 * @returns {void}
	 */

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSendMessage();
			}
		},
		[handleSendMessage],
	);

	/**
	 * Handles text input changes and triggers mentions dropdown.
	 * @param e - Input change event
	 * @returns {void}
	 */

	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		setMessageInput(value);

		// Check for @ mention trigger
		const lastAtIndex = value.lastIndexOf("@");
		if (lastAtIndex !== -1 && (lastAtIndex === 0 || value[lastAtIndex - 1] === " ")) {
			const query = value.slice(lastAtIndex + 1);
			if (!query.includes(" ")) {
				setShowMentions(true);
				setMentionQuery(query);
				return;
			}
		}
		setShowMentions(false);
	}, []);

	/**
	 * Inserts a selected mention into the message input.
	 * @param option - Selected mention option
	 * @returns {void}
	 */

	const handleMentionSelect = useCallback(
		(option: MentionOption) => {
			const lastAtIndex = messageInput.lastIndexOf("@");
			const newInput = messageInput.slice(0, lastAtIndex) + option.label + " ";
			setMessageInput(newInput);
			setShowMentions(false);
			textareaRef.current?.focus();
		},
		[messageInput],
	);

	/**
	 * Inserts markdown formatting around the selection or at cursor.
	 * @param before - Prefix to insert
	 * @param after - Suffix to insert
	 * @returns {void}
	 */

	const handleMarkdownInsert = useCallback(
		(before: string, after: string) => {
			const textarea = textareaRef.current;
			if (!textarea) return;

			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const text = messageInput;
			const selected = text.slice(start, end);
			const newText = text.slice(0, start) + before + selected + after + text.slice(end);

			setMessageInput(newText);
			setTimeout(() => {
				textarea.focus();
				const cursorPos = start + before.length + selected.length + after.length;
				textarea.setSelectionRange(cursorPos, cursorPos);
			}, 0);
		},
		[messageInput],
	);

	/**
	 * Opens the context menu at the right-click position.
	 * @param e - Mouse event
	 * @param messageId - ID of the right-clicked message
	 * @returns {void}
	 */

	const handleContextMenu = useCallback(
		(e: React.MouseEvent, messageId: string) => {
			const msg = activeMessages.find((m) => m.id === messageId);
			setContextMenu({
				x: Math.min(e.clientX, window.innerWidth - 240),
				y: Math.min(e.clientY, window.innerHeight - 300),
				messageId,
				isOwnMessage: msg?.authorId === CURRENT_USER_ID,
			});
		},
		[activeMessages],
	);

	/**
	 * Processes context menu actions.
	 * @param action - Action identifier
	 * @param messageId - Target message ID
	 * @returns {void}
	 */

	const handleContextAction = useCallback(
		(action: string, messageId: string) => {
			const msg = activeMessages.find((m) => m.id === messageId);
			if (!msg) return;

			switch (action) {
				case "edit":
					setEditingMessageId(messageId);
					setMessageInput(msg.content);
					textareaRef.current?.focus();
					break;
				case "delete":
					deleteMessage(activeChannel, messageId);
					showSuccess("Message supprimé.");
					break;
				case "copy":
					navigator.clipboard.writeText(msg.content);
					showSuccess("Message copié dans le presse-papier.");
					break;
				case "pin":
					togglePinMessage(activeChannel, messageId);
					showInfo(msg.isPinned ? "Message désépinglé." : "Message épinglé.");
					break;
				case "save":
					showInfo("Message enregistré pour plus tard.");
					break;
				case "unread":
					showInfo("Conversation marquée comme non lue.");
					break;
				case "react":
					showInfo("Sélecteur de réactions bientôt disponible.");
					break;
			}
		},
		[activeChannel, activeMessages, deleteMessage, togglePinMessage],
	);

	// Render
	return (
		<div className="flex h-[calc(100vh-4rem)] overflow-hidden">
			{/* Left Sidebar */}
			<aside className="flex w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
				{/* Search */}
				<div className="border-b border-gray-200 p-3 dark:border-gray-700">
					<div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-700">
						<Icon name="search" size="sm" className="text-gray-400" />
						<input
							type="text"
							placeholder="Rechercher..."
							value={sidebarSearch}
							onChange={(e) => setSidebarSearch(e.target.value)}
							className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none dark:text-gray-300 dark:placeholder-gray-500"
						/>
					</div>
				</div>

				{/* New group button */}
				<div className="px-3 pt-3 pb-1">
					<button
						onClick={() => showInfo("Création de groupe bientôt disponible.")}
						className="hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:border-primary-500 dark:hover:bg-primary-900/10 dark:hover:text-primary-400 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 px-3 py-2 text-sm font-medium text-gray-500 transition-colors dark:border-gray-700 dark:text-gray-400"
					>
						<Icon name="plus" size="sm" />
						Nouveau groupe
					</button>
				</div>

				{/* Scrollable channel list */}
				<div className="flex-1 overflow-y-auto px-2 py-2">
					{/* Channels */}
					<div className="mb-3">
						<span className="mb-1 block px-2 text-[10px] font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
							Canaux
						</span>
						{channels
							.filter((c) => !sidebarSearch || c.name.toLowerCase().includes(sidebarSearch.toLowerCase()))
							.map((channel) => (
								<button
									key={channel.id}
									onClick={() => setActiveChannel(channel.id)}
									className={cn(
										"flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors",
										activeChannel === channel.id
											? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
											: "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700",
									)}
								>
									<span className="text-sm font-medium text-gray-400">#</span>
									<span className="min-w-0 flex-1 truncate text-sm font-medium">{channel.name}</span>
									{channel.unreadCount > 0 && (
										<span className="bg-primary-500 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white">
											{channel.unreadCount}
										</span>
									)}
								</button>
							))}
					</div>

					{/* Direct Messages */}
					<div className="mb-3">
						<span className="mb-1 block px-2 text-[10px] font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
							Messages directs
						</span>
						{directMessages
							.filter(
								(dm) =>
									!sidebarSearch || dm.userName.toLowerCase().includes(sidebarSearch.toLowerCase()),
							)
							.map((dm) => (
								<button
									key={dm.id}
									onClick={() => setActiveChannel(dm.id)}
									className={cn(
										"flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors",
										activeChannel === dm.id
											? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
											: "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700",
									)}
								>
									<div className="relative flex-shrink-0">
										<Avatar name={dm.userName} src={dm.userAvatar} size="xs" />
										<span
											className={cn(
												"absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-gray-800",
												dm.presence === "online"
													? "bg-green-500"
													: dm.presence === "away"
														? "bg-amber-500"
														: "bg-gray-400",
											)}
										/>
									</div>
									<div className="min-w-0 flex-1">
										<div className="flex items-center gap-1">
											<span className="truncate text-sm font-medium">{dm.userName}</span>
											{dm.userRole === "owner" && (
												<svg
													className="h-3 w-3 flex-shrink-0 text-amber-500"
													viewBox="0 0 24 24"
													fill="currentColor"
												>
													<path d="M2.5 19h19v2h-19v-2zm19.57-9.36c-.21-.8-1.04-1.28-1.84-1.06L14.97 10l-2.78-6.97a1.5 1.5 0 0 0-2.79-.02L6.64 10l-5.26-1.42c-.8-.22-1.63.26-1.84 1.06-.22.8.26 1.64 1.06 1.84L5.5 13l1.5 4h10l1.5-4 4.9-1.52c.8-.2 1.28-1.04 1.07-1.84z" />
												</svg>
											)}
										</div>
										{dm.lastMessage && (
											<p className="truncate text-xs text-gray-400 dark:text-gray-500">
												{dm.lastMessage}
											</p>
										)}
									</div>
									{dm.unreadCount > 0 && (
										<span className="bg-primary-500 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white">
											{dm.unreadCount}
										</span>
									)}
								</button>
							))}
					</div>

					{/* Private Groups */}
					<div>
						<span className="mb-1 block px-2 text-[10px] font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
							Groupes privés
						</span>
						{privateGroups
							.filter(
								(pg) => !sidebarSearch || pg.name.toLowerCase().includes(sidebarSearch.toLowerCase()),
							)
							.map((pg) => (
								<button
									key={pg.id}
									onClick={() => setActiveChannel(pg.id)}
									className={cn(
										"flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors",
										activeChannel === pg.id
											? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
											: "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700",
									)}
								>
									<Icon name="lock" size="sm" className="flex-shrink-0 text-gray-400" />
									<span className="min-w-0 flex-1 truncate text-sm font-medium">{pg.name}</span>
									{pg.unreadCount > 0 && (
										<span className="bg-primary-500 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white">
											{pg.unreadCount}
										</span>
									)}
								</button>
							))}
					</div>
				</div>

				{/* Access notice */}
				<div className="border-t border-gray-200 px-3 py-2.5 dark:border-gray-700">
					<div className="flex items-start gap-2 rounded-lg bg-amber-50 px-2.5 py-2 dark:bg-amber-900/10">
						<Icon name="lock" size="xs" className="mt-0.5 flex-shrink-0 text-amber-500" />
						<p className="text-[11px] leading-relaxed text-amber-700 dark:text-amber-400">
							Actuellement disponible pour : Legacy, Marsha et Jeremy
						</p>
					</div>
				</div>
			</aside>

			{/* Main Chat Area */}
			<div className="flex min-w-0 flex-1 flex-col bg-white dark:bg-gray-900">
				{/* Chat header */}
				<div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-gray-700">
					<div className="flex items-center gap-3">
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							{activeChannelInfo ? `# ${activeName}` : activeName}
						</h2>
						<Badge variant="neutral" showDot={false}>
							{activeMemberCount} membre{activeMemberCount > 1 ? "s" : ""}
						</Badge>
						{activeChannelInfo?.description && (
							<span className="hidden text-sm text-gray-400 lg:block">
								{activeChannelInfo.description}
							</span>
						)}
					</div>
					<div className="flex items-center gap-1">
						<button
							onClick={() => showInfo("Recherche dans le canal bientôt disponible.")}
							className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
							title="Rechercher dans le canal"
						>
							<Icon name="search" size="sm" />
						</button>
						<button
							onClick={() => {
								const pinned = activeMessages.filter((m) => m.isPinned);
								if (pinned.length === 0) {
									showInfo("Aucun message épinglé dans ce canal.");
								} else {
									showInfo(`${pinned.length} message(s) épinglé(s) dans ce canal.`);
								}
							}}
							className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
							title="Messages épinglés"
						>
							<Icon name="flag" size="sm" />
						</button>
						<button
							className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
							title="Membres du canal"
						>
							<Icon name="users" size="sm" />
						</button>
					</div>
				</div>

				{/* Messages area */}
				<div className="flex-1 overflow-y-auto py-4">
					{activeMessages.length === 0 ? (
						<div className="flex h-full flex-col items-center justify-center text-center">
							<Icon name="chat" size="xl" className="mb-3 text-gray-300 dark:text-gray-600" />
							<p className="text-sm text-gray-400 dark:text-gray-500">Aucun message dans ce canal.</p>
							<p className="text-xs text-gray-300 dark:text-gray-600">
								Sois le premier à écrire quelque chose !
							</p>
						</div>
					) : (
						<>
							{activeMessages.map((msg) => (
								<MessageBubble key={msg.id} message={msg} onContextMenu={handleContextMenu} />
							))}
							<div ref={messagesEndRef} />
						</>
					)}
				</div>

				{/* Message input area */}
				<div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
					{/* Editing indicator */}
					{editingMessageId && (
						<div className="mb-2 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 dark:bg-amber-900/10">
							<Icon name="edit" size="xs" className="text-amber-500" />
							<span className="text-xs text-amber-700 dark:text-amber-400">Modification en cours</span>
							<button
								onClick={() => {
									setEditingMessageId(null);
									setMessageInput("");
								}}
								className="ml-auto text-xs text-amber-500 hover:text-amber-700 dark:hover:text-amber-300"
							>
								Annuler
							</button>
						</div>
					)}

					{/* Input container */}
					<div className="focus-within:border-primary-400 dark:focus-within:border-primary-500 relative rounded-xl border border-gray-200 bg-gray-50 transition-colors focus-within:bg-white dark:border-gray-700 dark:bg-gray-800 dark:focus-within:bg-gray-800">
						{/* Toolbar */}
						<div className="flex items-center justify-between border-b border-gray-200 px-3 py-1.5 dark:border-gray-700">
							<MarkdownToolbar onInsert={handleMarkdownInsert} />
							<div className="flex items-center gap-2">
								{messageInput.length > MAX_MESSAGE_LENGTH * 0.8 && (
									<span
										className={cn(
											"text-xs font-medium",
											messageInput.length > MAX_MESSAGE_LENGTH
												? "text-error-500"
												: "text-amber-500",
										)}
									>
										{messageInput.length}/{MAX_MESSAGE_LENGTH}
									</span>
								)}
							</div>
						</div>

						{/* Textarea */}
						<div className="relative">
							{showMentions && (
								<MentionDropdown
									options={mentionOptions}
									query={mentionQuery}
									onSelect={handleMentionSelect}
									onClose={() => setShowMentions(false)}
								/>
							)}
							<textarea
								ref={textareaRef}
								value={messageInput}
								onChange={handleInputChange}
								onKeyDown={handleKeyDown}
								placeholder="Écrire un message..."
								rows={1}
								className="max-h-48 w-full resize-none bg-transparent px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none dark:text-gray-300 dark:placeholder-gray-500"
							/>
						</div>

						{/* Bottom bar */}
						<div className="flex items-center justify-between px-3 py-1.5">
							<div className="flex items-center gap-1">
								<button
									title="Joindre un fichier (max 10 MB)"
									className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
								>
									<Icon name="attach" size="sm" />
								</button>
								<span className="text-[10px] text-gray-300 dark:text-gray-600">Max 10 MB</span>
							</div>
							<Button
								variant="primary"
								size="sm"
								onClick={handleSendMessage}
								disabled={!messageInput.trim() || messageInput.length > MAX_MESSAGE_LENGTH}
							>
								{editingMessageId ? "Modifier" : "Envoyer"}
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Context Menu */}
			{contextMenu && (
				<ChatContextMenu
					position={contextMenu}
					onClose={() => setContextMenu(null)}
					onAction={handleContextAction}
				/>
			)}
		</div>
	);
}
