import "dotenv/config";
import {Client, CommandInteraction, Constants, ModalSubmitInteraction} from "oceanic.js";
import { setVent } from "./util/Vent";
import { marked } from "marked";

// dayjs
import dayjsUTC from "dayjs/plugin/utc";
import dayjsTZ from "dayjs/plugin/timezone";
import dayjs from "dayjs";
dayjs.extend(dayjsUTC);
dayjs.extend(dayjsTZ);

// bot client
const client = new Client({
  auth: `Bot ${process.env.BOT_TOKEN}`
});

client.on("ready", async () => {
  try {
    // add /vent
    await client.application.bulkEditGuildCommands(process.env.GUILD_ID as string, [{
      name: "vent",
      type: Constants.ApplicationCommandTypes.CHAT_INPUT,
      description: "Upload venting message to website."
    }]);

    console.log("Bot: Ready.");
  } catch (error) {
    throw error;
  };
});

client.on("interactionCreate", async (interaction) => {
  const ventCustomIDModal = "vent_modal";

  try {
    if (interaction instanceof CommandInteraction) {
      if (interaction.data.name == "vent") {
        return interaction.createModal({
          title: "Vent Modal",
          customID: ventCustomIDModal,
          components: [{
            type: Constants.ComponentTypes.ACTION_ROW,
            components: [{
              label: "Message",
              style: Constants.TextInputStyles.PARAGRAPH,
              minLength: 1,
              // @ts-ignore
              maxLength: 2048,
              required: true, type: Constants.ComponentTypes.TEXT_INPUT,
              customID: "vent_message"
            }]
          }]
        });
      };
    };

    if (interaction instanceof ModalSubmitInteraction) {
      if (interaction.data.customID == ventCustomIDModal) {
        const message = interaction.data.components[0].components[0]?.value;
        if (!message) return interaction.createMessage({content: "Invalid vent message value."});

        await setVent(marked.parseInline(message, { gfm: true, breaks: true }));

        return interaction.createMessage({content: "Successfully created a new vent."});
      };
    };
  } catch (error) {
    console.error(error);
    return;
  };
});

export default client.connect();