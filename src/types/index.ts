export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export type Message = {
  id: string;
  assessment_id?: string;
  chat_id?: string;
  file_ids?: string[];
  instructions?: string;
  role: RoleEnum;
  content: string;
  created_at: string;
};

export type Chat = {
  id: string;
  assessment_id?: string;
  title: string;
  initial_message?: string;
  created_at: string;
}

export type Assessment = {
  id: string;
  user_id: string;
  title: string;
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
  download_url: string;
}

export type ChatPromptBoxProps = {
  action: (msg: string, files: File[]) => void;
};

export type ContextDockProps = {
  action: (files: File[], instructions: string[]) => void;
};

export type InstructionsPopoverProps = {
  action: (instructions: string[]) => void;
};
