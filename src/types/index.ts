export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export type Message = {
  id: string;
  chat_id?: string;
  file_id?: string;
  role: RoleEnum;
  content: string;
  created_at: string;
};

export type Assessment = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export type Chat = {
  id: string;
  assessment_id: string;
  created_at: string;
}

export enum RoleEnum {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system"
}

export type FileType = {
  id: string;
  user_id: string;
  filename: string;
  ai_file_id: string;
  uploaded_at: string;
}

export type ChatPromptBoxProps = {
  action: (msg: string, files: File[]) => void;
};

