import "dotenv/config";
import {Client, CommandInteraction, Constants, ModalSubmitInteraction} from "oceanic.js";
import { setVent, deleteVent } from "./util/Vent";

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
    await client.application.bulkEditGuildCommands(process.env.GUILD_ID as string, [
      {
        name: "vent",
        type: Constants.ApplicationCommandTypes.CHAT_INPUT,
        description: "Upload venting message to website."
      },
      {
        name: "vent-delete",
        type: Constants.ApplicationCommandTypes.CHAT_INPUT,
        description: "Delete vent message with the ID.",
        options: [{
          name: "vent-id",
          description: "The ID of the vent.",
          type: Constants.ApplicationCommandOptionTypes.STRING,
          required: true
        }]
      }
    ]);

    console.log("Bot: Ready.");
  } catch (error) {
    throw error;
  };
});

client.on("interactionCreate", async (interaction) => {
  const ventCustomIDModal = "vent_modal";

  try {
    if (interaction instanceof CommandInteraction) {
      switch (interaction.data.name) {
        case "vent": {
          return interaction.createModal({
            title: "Vent Modal",
            customID: ventCustomIDModal,
            components: [{
              type: Constants.ComponentTypes.ACTION_ROW,
              components: [{
                label: "Message",
                style: Constants.TextInputStyles.PARAGRAPH,
                minLength: 1,
                maxLength: 2048,
                required: true, type: Constants.ComponentTypes.TEXT_INPUT,
                customID: "vent_message"
              }]
            }]
          });
        };

        case "vent-delete": {
          await interaction.defer(64);

          const ventID = interaction.data.options.getString("vent-id", true);
          const deletion = await deleteVent(ventID);

          if (!deletion) return interaction.createFollowup({content: "Unable to delete the current vent message."});

          return interaction.createFollowup({content: "Successfully removed the preferred vent."});
        };
      };
    };

    if (interaction instanceof ModalSubmitInteraction) {
      if (interaction.data.customID == ventCustomIDModal) {
        await interaction.defer(64);

        const message = interaction.data.components[0].components[0]?.value;
        if (!message) return interaction.createFollowup({content: "Invalid vent message value."});

        await setVent(message);

        return interaction.createFollowup({content: "Successfully created a new vent."});
      };
    };
  } catch (error) {
    console.error(error);
    return;
  };
});

export default client.connect();