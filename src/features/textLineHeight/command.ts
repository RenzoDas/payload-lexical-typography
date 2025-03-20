import { createCommand } from "@payloadcms/richtext-lexical/lexical";

export const TEXT_LINE_HEIGHT_COMMAND = createCommand<{ lineHeight: string }>("TEXT_LINE_HEIGHT_COMMAND");