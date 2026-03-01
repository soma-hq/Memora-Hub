/** Represents a ping notification from another user */
export interface PingNotification {
	/** Unique ping identifier */
	id: string;
	/** User who sent the ping */
	fromUserId: string;
	/** Display name of the sender */
	fromUserName: string;
	/** Avatar URL of the sender */
	fromUserAvatar?: string;
	/** Target user who received the ping */
	toUserId: string;
	/** Where the ping was triggered (page path) */
	targetPath: string;
	/** Human-readable label for the target location */
	targetLabel: string;
	/** Optional context message */
	message?: string;
	/** When the ping was sent */
	createdAt: Date;
	/** Whether the ping has been read */
	read: boolean;
}

/** State shape for the ping store */
export interface PingState {
	/** All received pings */
	pings: PingNotification[];
	/** Latest unread ping (for bubble display) */
	latestUnread: PingNotification | null;
	/** Whether the bubble is currently visible */
	bubbleVisible: boolean;
}
