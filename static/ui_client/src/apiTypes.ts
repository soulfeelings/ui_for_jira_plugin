export type Character = {
    id: string;
    name: string;
    createdAt: string;
}

export type User = {
    id: string;
    email: string;
    name: string;
    avatar: string;
    jira_id: string;
    createdAt: string;
    updatedAt: string;
}

export type Level = {
    id: string;
    level: number;
    xp_required: number;
    name: string;
    created: string;
    updated: string;
}

export type UserCharacterExpandedCharacter = {
    id: string;
    user_id: string;
    character_id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    expand: {
        character_id: Character;
    }
}


export type UserLevel = {
    id: string;
    user_id: string;
    level: number;
    xp: number;
    created: string;
    updated: string;
    collectionId: string;
    collectionName: string;
}

export type UserXp = {
    id: string;
    user_id: string;
    xp: number;
    created: string;
    updated: string;
    collectionId: string;
    collectionName: string;
}
