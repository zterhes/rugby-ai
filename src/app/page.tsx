"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import Image from "next/image";
import { Action, Actions } from "@/components/ai-elements/actions";
import { Fragment, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Response } from "@/components/ai-elements/response";
import { CopyIcon, ImageIcon, RefreshCcwIcon } from "lucide-react";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";
import { ApiTemplateIoResponse } from "@/lib/schemas";
import { ImageViewer } from "@/components/image-viewer";
import logo from "@/assets/szines_logo.png";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

const models = [
  {
    name: "Gemini 2.5 Flash",
    value: "google/gemini-2.5-flash",
  },
];

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const { messages, sendMessage, status, regenerate } = useChat();
  const { t } = useLanguage();

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage({
      text: message.text || "Sent with attachments",
      files: message.files,
    });
    setInput("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-screen bg-gradient-to-br from-gradient-start via-gradient-mid to-gradient-end">
      <div className="flex flex-col h-full">
        <header className="mb-8 animate-fade-in">
          <div className="backdrop-blur-xl bg-card/40 border border-border/50 rounded-3xl p-6 shadow-lg flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Image
                src={logo.src}
                alt="Honcharosun Gorillak Rugby Club"
                className="h-16 w-16 object-contain drop-shadow-lg"
                width={64}
                height={64}
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {t.header.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t.header.subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <UserButton
                showName
                appearance={{
                  variables: {
                    colorPrimary: "hsl(var(--primary))",
                    colorForeground: "hsl(var(--foreground))",
                    colorBackground: "hsl(var(--background))",
                    colorText: "hsl(var(--foreground))",
                  },
                  elements: {
                    userButtonPopoverCard: {
                      background: "hsl(var(--background))",
                      color: "hsl(var(--foreground))",
                    },
                  },
                }}
              />
            </div>
          </div>
        </header>
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === "assistant" &&
                  message.parts.filter((part) => part.type === "source-url")
                    .length > 0 && (
                    <Sources>
                      <SourcesTrigger
                        count={
                          message.parts.filter(
                            (part) => part.type === "source-url"
                          ).length
                        }
                      />
                      {message.parts
                        .filter((part) => part.type === "source-url")
                        .map((part, i) => (
                          <SourcesContent key={`${message.id}-${i}`}>
                            <Source
                              key={`${message.id}-${i}`}
                              href={part.url}
                              title={part.url}
                            />
                          </SourcesContent>
                        ))}
                    </Sources>
                  )}
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent
                              className={cn(
                                "max-w-[80%] rounded-2xl px-6 py-4 backdrop-blur-xl border transition-all duration-300",
                                "shadow-lg hover:shadow-xl",
                                message.role === "user"
                                  ? "bg-primary/10 border-primary/20 text-foreground ml-auto"
                                  : "bg-card/40 border-border/50 text-foreground"
                              )}
                              style={{
                                backdropFilter: "blur(20px)",
                              }}
                            >
                              <Response className="">{part.text}</Response>
                            </MessageContent>
                          </Message>
                          {message.role === "assistant" &&
                            i === messages.length - 1 && (
                              <Actions className="mt-2">
                                <Action
                                  onClick={() => regenerate()}
                                  label="Retry"
                                >
                                  <RefreshCcwIcon className="size-3" />
                                </Action>
                                <Action
                                  onClick={() =>
                                    navigator.clipboard.writeText(part.text)
                                  }
                                  label="Copy"
                                >
                                  <CopyIcon className="size-3" />
                                </Action>
                              </Actions>
                            )}
                        </Fragment>
                      );
                    case "reasoning":
                      return (
                        <Reasoning
                          key={`${message.id}-${i}`}
                          className="w-full"
                          isStreaming={
                            status === "streaming" &&
                            i === message.parts.length - 1 &&
                            message.id === messages.at(-1)?.id
                          }
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>{part.text}</ReasoningContent>
                        </Reasoning>
                      );
                    case "tool-rosterImageGenerator":
                      const output = part.output as ApiTemplateIoResponse;
                      return (
                        <Fragment key={`${message.id}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent
                              className={cn(
                                "max-w-[80%] rounded-2xl px-6 py-4 backdrop-blur-xl border transition-all duration-300",
                                "shadow-lg hover:shadow-xl",
                                message.role === "user"
                                  ? "bg-primary/10 border-primary/20 text-foreground ml-auto"
                                  : "bg-card/40 border-border/50 text-foreground"
                              )}
                              style={{
                                backdropFilter: "blur(20px)",
                              }}
                            >
                              {part.state === "output-available" &&
                                output.download_url_png && (
                                  <ImageViewer
                                    src={output.download_url_png}
                                    alt="Roster Image"
                                  />
                                )}
                              {part.state === "output-error" && (
                                <Response>{part.state}</Response>
                              )}
                            </MessageContent>
                          </Message>
                        </Fragment>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            ))}
            {status === "submitted" && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput
          onSubmit={handleSubmit}
          className="backdrop-blur-xl bg-card/40 border border-border/50 rounded-3xl p-4 shadow-lg mt-4"
          globalDrop
          multiple
        >
          <PromptInputHeader>
            <PromptInputAttachments>
              {(attachment) => <PromptInputAttachment data={attachment} />}
            </PromptInputAttachments>
          </PromptInputHeader>
          <PromptInputBody>
            <PromptInputTextarea
              className="min-h-[60px] max-h-[200px] resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
              placeholder={t.chat.placeholder}
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments
                    label={t.chat.addAttachmentsOrFiles}
                    className="bg-black/20"
                  />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <PromptInputButton
                onClick={() => {
                  sendMessage({
                    text: "Generate team picture",
                    files: [],
                  });
                }}
              >
                <ImageIcon size={16} />
                <span>{t.chat.generateTeamPicture}</span>
              </PromptInputButton>
              <PromptInputModelSelect
                onValueChange={(value) => {
                  setModel(value);
                }}
                value={model}
              >
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {models.map((model) => (
                    <PromptInputModelSelectItem
                      key={model.value}
                      value={model.value}
                    >
                      {model.name}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>
            <PromptInputSubmit
              className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              disabled={!input && !status}
              status={status}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};

const ChatBotDemoWrapper = () => {
  return (
    <LanguageProvider>
      <ChatBot />
    </LanguageProvider>
  );
};

export default ChatBotDemoWrapper;
