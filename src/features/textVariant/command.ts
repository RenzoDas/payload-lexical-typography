import { createCommand } from "@payloadcms/richtext-lexical/lexical";

export const TEXT_VARIANT_COMMAND = createCommand<{ variant: string }>("TEXT_VARIANT_COMMAND");
