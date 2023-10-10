const { Telegraf } = require("telegraf");
const mongoose = require("mongoose");
const texts = require("./custom");
require("dotenv").config();

(async () => {
    await mongoose.connect("mongodb://localhost:27017/telegraf");

    console.log("DB Connected!")
})()

const orderSchema = mongoose.Schema({
    save: { type: String, require: false },
    user: { type: Object, required: true },
    chatId: { type: Number, required: true },
    data: { type: String, required: true },
    date: { type: Date, default: Date.now },
    receipt: { type: String, required: false }
});

const order = mongoose.model("orders", orderSchema);

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(texts.start.welcome, texts.start.options);
});

const insertAction = (btn_type) => {
  const type = btn_type.slice(4)

  bot.action(btn_type, async (ctx) => {
    const sendedMessage = (await ctx.reply(texts.actions.buttons[type].text, texts.actions.buttons[type].options));
    ctx.deleteMessage(sendedMessage.message_id-1)
  });
}

const insertSubAction = (btn_type) => {
    bot.action(btn_type, async (ctx) => {
        const sendedMessage = (await
            ctx.reply(
                await texts.actions.buttons.buy.text(btn_type), 
                texts.actions.buttons.buy.options()
            )
        );
        ctx.deleteMessage(sendedMessage.message_id-1)
    })
}

const insertDepositMethod = (depositType) => {
    bot.action(depositType, async (ctx) => {
        const sendedMessage = (await
            ctx.reply(
                texts.actions.buttons.depositMethod.text(depositType),
                texts.actions.buttons.depositMethod.options()
            )
        );
        ctx.deleteMessage(sendedMessage.message_id-1)
    })
}

const insertSave = (save) => {
    saveArry = save.split("-");

    const finalSave = saveArry.pop();

    bot.action(save, async (ctx) => {
        const sendedMessage = (await
            ctx.reply(
                texts.actions.buttons.depositMethod.text(save, finalSave)
            )
        );
        ctx.deleteMessage(sendedMessage.message_id-1)

        let createdOrder;

        bot.on("text", async (ctx) => {
            const finalData = {
                save: finalSave,
                user: ctx.chat,
                chatId: ctx.chat.id,
                data: ctx.message.text
            }

            createdOrder = await order.create(finalData);

            await ctx.reply(
                texts.paymentMethod.text,
                texts.paymentMethod.options
            );
        })
        bot.action("payment_card", async (ctx) => {
            await ctx.reply(texts.paymentMethod.card.text);

            bot.on("message", async (ctx) => {
                if (ctx.message.photo !== undefined) {
                    const fileLink = await bot.telegram.getFileLink(ctx.message.photo[0].file_id);
                    console.log(createdOrder)
                    // await order.findByIdAndUpdate(createdOrder._id, { receipt: fileLink }, {new: true })
                } else if (ctx.message.text !== undefined) {
                    console.log(createdOrder)
                    // await order.findByIdAndUpdate(createdOrder._id, { receipt: ctx.message.text }, { new: true })
                } else {
                    ctx.reply("رسید باید متن یا عکس باشد لطفا مجددا تلاش کنید.");
                }
            })
        })
    });
}

insertSave("btn-120-cp-data-facebook");
insertSave("btn-120-cp-data-activision");
insertSave("btn-60-cp-data-facebook");
insertSave("btn-60-cp-data-activision");

insertDepositMethod("btn-110-gem-id");
insertDepositMethod("btn-110-gem-data");
insertDepositMethod("btn-60-uc-id");
insertDepositMethod("btn-120-uc-id");
insertDepositMethod("btn-60-cp-data");
insertDepositMethod("btn-120-cp-data");

insertSubAction("btn-110-gem");
insertSubAction("btn-210-gem");
insertSubAction("btn-60-uc");
insertSubAction("btn-120-uc");
insertSubAction("btn-60-cp");
insertSubAction("btn-120-cp");

insertAction("btn-gem");
insertAction("btn-uc");
insertAction("btn-cp");

bot.launch();