// ─── User hierarchy roles ────────────────────────────────────────────────────

/** Chat user hierarchy level */
export type ChatRole = "owner" | "admin" | "collaborator" | "bot";

/** Online presence status */
export type PresenceStatus = "online" | "away" | "offline" | "dnd";

// ─── Channel types ──────────────────────────────────────────────────────────

/** Type of chat channel */
export type ChannelType = "channel" | "direct" | "private-group";

/** A chat channel (public, DM, or private group) */
export interface Channel {
	id: string;
	name: string;
	type: ChannelType;
	description?: string;
	icon?: string;
	members: string[];
	lastMessage?: string;
	lastMessageAt?: string;
	lastMessageAuthor?: string;
	unreadCount: number;
	isPinned?: boolean;
	isReadOnly?: boolean;
}

// ─── Message types ──────────────────────────────────────────────────────────

/** A file attachment on a chat message */
export interface ChatFileAttachment {
	id: string;
	filename: string;
	size: string;
	type: "image" | "document" | "archive" | "other";
	url?: string;
}

/** A single chat message */
export interface ChatMessage {
	id: string;
	channelId: string;
	authorId: string;
	authorName: string;
	authorRole: ChatRole;
	authorAvatar?: string | null;
	content: string;
	timestamp: string;
	editedAt?: string;
	attachments?: ChatFileAttachment[];
	mentions?: string[];
	isPinned?: boolean;
	reactions?: MessageReaction[];
	isSystem?: boolean;
}

/** A reaction on a message */
export interface MessageReaction {
	emoji: string;
	count: number;
	users: string[];
	hasReacted: boolean;
}

// ─── User types ─────────────────────────────────────────────────────────────

/** A chat user / member */
export interface ChatUser {
	id: string;
	name: string;
	role: ChatRole;
	avatar?: string | null;
	presence: PresenceStatus;
	lastSeen?: string;
}

// ─── Mention types ──────────────────────────────────────────────────────────

/** A mentionable target (group or individual) */
export interface MentionOption {
	id: string;
	label: string;
	type: "group" | "user";
	description?: string;
}

// ─── Direct message types ───────────────────────────────────────────────────

/** A direct message conversation */
export interface DirectMessage {
	id: string;
	userId: string;
	userName: string;
	userAvatar?: string | null;
	userRole: ChatRole;
	presence: PresenceStatus;
	lastMessage?: string;
	lastMessageAt?: string;
	unreadCount: number;
}

// ─── Private group types ────────────────────────────────────────────────────

/** A private group conversation */
export interface PrivateGroup {
	id: string;
	name: string;
	members: string[];
	lastMessage?: string;
	lastMessageAt?: string;
	unreadCount: number;
}

// ─── Context menu types ─────────────────────────────────────────────────────

/** A context menu action item */
export interface ContextMenuItem {
	id: string;
	label: string;
	icon: string;
	category: "message" | "organisation" | "reaction";
	ownMessageOnly?: boolean;
	onClick?: (messageId: string) => void;
}

/** Position for the context menu */
export interface ContextMenuPosition {
	x: number;
	y: number;
	messageId: string;
	isOwnMessage: boolean;
}

// ─── Store state type ───────────────────────────────────────────────────────

/** Complete chat store state and actions */
export interface ChatState {
	// Data
	activeChannel: string;
	channels: Channel[];
	messages: Record<string, ChatMessage[]>;
	directMessages: DirectMessage[];
	privateGroups: PrivateGroup[];
	users: ChatUser[];
	mentionOptions: MentionOption[];

	// Actions
	setActiveChannel: (id: string) => void;
	addMessage: (channelId: string, message: ChatMessage) => void;
	editMessage: (channelId: string, messageId: string, content: string) => void;
	deleteMessage: (channelId: string, messageId: string) => void;
	togglePinMessage: (channelId: string, messageId: string) => void;
	markChannelAsRead: (channelId: string) => void;

	// Helpers
	getActiveChannelMessages: () => ChatMessage[];
	getActiveChannelInfo: () => Channel | undefined;
	getUnreadTotal: () => number;
}
