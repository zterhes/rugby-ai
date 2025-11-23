export const translations = {
  en: {
    code: "eng",
    name: "English",
    flag: "🇬🇧",
    header: {
      title: "AI Agentic Assistant",
      subtitle: "Manage your team with ease",
    },
    chat: {
      addAttachmentsOrFiles: "Add attachments or files",
      placeholder: "How can I help you?",
      generateTeamPicture: "Generate Team Picture",
    },
  },
  hu: {
    code: "hun",
    name: "Magyar",
    flag: "🇭🇺",
    header: {
      title: "AI Agentic Assistant",
      subtitle: "Kezelje csapatát egyszerűen",
    },
    chat: {
      addAttachmentsOrFiles: "Fájlok hozzáadása",
      placeholder: "Miben segíthetek?",
      generateTeamPicture: "Csapatkép Generálása",
    },
  },
} as const;

export type Language = keyof typeof translations;
