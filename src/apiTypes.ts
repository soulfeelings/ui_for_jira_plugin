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



