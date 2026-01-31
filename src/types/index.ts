// Database Types
export interface Profile {
    id: string;
    user_id: string;
    display_name: string;
    avatar_url?: string;
    bio?: string;
    created_at: string;
    updated_at: string;
}

export interface Post {
    id: string;
    author_id: string;
    content: string;
    image_url?: string;
    circle_id?: string;
    created_at: string;
    updated_at: string;
    author?: Profile;
}

export interface Circle {
    id: string;
    name: string;
    description?: string;
    creator_id: string;
    is_private: boolean;
    created_at: string;
}

export interface CircleMember {
    id: string;
    circle_id: string;
    user_id: string;
    role: 'creator' | 'member';
    joined_at: string;
}

export interface Reaction {
    id: string;
    post_id: string;
    user_id: string;
    reaction_type: 'like' | 'love' | 'celebrate';
    created_at: string;
}

export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: string;
    updated_at: string;
    author?: Profile;
}

export interface Notification {
    id: string;
    user_id: string;
    type: 'like' | 'comment' | 'circle_join' | 'mention';
    content: string;
    is_read: boolean;
    related_id?: string;
    created_at: string;
}

// Auth Types
export interface AuthUser {
    id: string;
    email: string;
    profile?: Profile;
}

// Navigation Types
export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
    Login: undefined;
    Signup: undefined;
    Home: undefined;
    Profile: { userId?: string };
    EditProfile: undefined;
    CreatePost: undefined;
    PostDetail: { postId: string };
    Circles: undefined;
    CircleDetail: { circleId: string };
    CreateCircle: undefined;
    Notifications: undefined;
    Settings: undefined;
};
