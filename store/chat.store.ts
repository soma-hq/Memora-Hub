import { create } from "zustand";
import type {

	ChatState,
	Channel,
	ChatMessage,
	DirectMessage,
	PrivateGroup,
	ChatUser,
	MentionOption,
} from "@/features/chat/types";

// Store

/**
 * Zustand store for the chat feature, including channels, messages, DMs, and groups.
 * @returns {ChatState} Chat state with all data and actions
 */
export const useChatStore = create<ChatState>((set, get) => ({
	// Data
	activeChannel: "general",
	channels: [],
	messages: {},
	directMessages: [],
	privateGroups: [],
	users: [],
	mentionOptions: [],

	// Actions

	/**
	 * Sets the currently active channel and marks it as read.
	 * @param id - Channel identifier
	 * @returns {void}
	 */
	setActiveChannel: (id) => {
		set({ activeChannel: id });
		get().markChannelAsRead(id);
	},

	/**
	 * Adds a new message to a channel.
	 * @param channelId - Target channel identifier
	 * @param message - Message to add
	 * @returns {void}
	 */
	addMessage: (channelId, message) =>
		set((s) => ({
			messages: {
				...s.messages,
				[channelId]: [...(s.messages[channelId] || []), message],
			},
		})),

	/**
	 * Edits the content of an existing message.
	 * @param channelId - Channel containing the message
	 * @param messageId - Message to edit
	 * @param content - New message content
	 * @returns {void}
	 */
	editMessage: (channelId, messageId, content) =>
		set((s) => ({
			messages: {
				...s.messages,
				[channelId]: (s.messages[channelId] || []).map((m) =>
					m.id === messageId ? { ...m, content, editedAt: new Date().toISOString() } : m,
				),
			},
		})),

	/**
	 * Deletes a message from a channel.
	 * @param channelId - Channel containing the message
	 * @param messageId - Message to delete
	 * @returns {void}
	 */
	deleteMessage: (channelId, messageId) =>
		set((s) => ({
			messages: {
				...s.messages,
				[channelId]: (s.messages[channelId] || []).filter((m) => m.id !== messageId),
			},
		})),

	/**
	 * Toggles the pinned state of a message.
	 * @param channelId - Channel containing the message
	 * @param messageId - Message to toggle
	 * @returns {void}
	 */
	togglePinMessage: (channelId, messageId) =>
		set((s) => ({
			messages: {
				...s.messages,
				[channelId]: (s.messages[channelId] || []).map((m) =>
					m.id === messageId ? { ...m, isPinned: !m.isPinned } : m,
				),
			},
		})),

	/**
	 * Resets the unread counter for a channel (or DM / group).
	 * @param channelId - Channel to mark as read
	 * @returns {void}
	 */
	markChannelAsRead: (channelId) =>
		set((s) => ({
			channels: s.channels.map((c) => (c.id === channelId ? { ...c, unreadCount: 0 } : c)),
			directMessages: s.directMessages.map((d) => (d.id === channelId ? { ...d, unreadCount: 0 } : d)),
			privateGroups: s.privateGroups.map((g) => (g.id === channelId ? { ...g, unreadCount: 0 } : g)),
		})),

	// Helpers

	/**
	 * Returns messages for the currently active channel.
	 * @returns {ChatMessage[]} Array of messages
	 */
	getActiveChannelMessages: () => {
		const state = get();
		return state.messages[state.activeChannel] || [];
	},

	/**
	 * Returns channel info for the currently active channel.
	 * @returns {Channel | undefined} Active channel data
	 */
	getActiveChannelInfo: () => {
		const state = get();
		return state.channels.find((c) => c.id === state.activeChannel);
	},

	/**
	 * Returns the total unread count across all channels, DMs, and groups.
	 * @returns {number} Total unread messages
	 */
	getUnreadTotal: () => {
		const state = get();
		const channelUnread = state.channels.reduce((sum, c) => sum + c.unreadCount, 0);
		const dmUnread = state.directMessages.reduce((sum, d) => sum + d.unreadCount, 0);
		const groupUnread = state.privateGroups.reduce((sum, g) => sum + g.unreadCount, 0);
		return channelUnread + dmUnread + groupUnread;
	},
}));
