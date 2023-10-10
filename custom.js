const useMarkup = (options) => {
  return {
    reply_markup: {
      inline_keyboard: options,
    },
  };
};

module.exports = {
  selectedPack: null,
  paymentMethod: {
    text: "لطفا روش پرداخت را انتخاب کنید.",
    options: useMarkup([
      [ 
        { text: "پرداخت از طریق کارت به کارت 💳", callback_data: "payment_card" }
      ]
    ]),
    card: {
      text: "لطفا عکس / متن رسید پرداخت را ارسال کنید.",
    },
    completed: {
      text: (tracking_code) => {
        return `
        سفارش شما با موفقیت انجام شد ✅
        کد پیگیری: ${tracking_code}
        پیگیری از طریق ربات @patrick_support_bot
        `
      }
    }
  },
  start: {
    welcome: "سلام به ربات پاتریک خوش آمدید چه کاری میتونم براتون انجام بدم؟",
    options: useMarkup([
      [
        { text: "خرید جم فری فایر 💎", callback_data: "btn-gem" }],
        [{ text: "خرید uc پابجی 🎮", callback_data: "btn-uc" }],
        [{ text: "خرید cp کالاف 🟨⬛", callback_data: "btn-cp" },
      ],
    ]),
  },
  actions: {
    buttons: {
      save: null,
      depositMethod: {
        text: (selectedPack, save = null) => {
          const selectedPackArry = selectedPack.split("-");

          selectedPackArry.shift();

          let currency;

          switch(selectedPackArry[1]) {
            case "gem":
                currency = "جم 💎";
            break
            case "cp":
                currency = "سی پی 🟨"
            break
            case "uc":
                currency = "یوسی ⭐"
          }

          let depositMethod;
          let depositMethodTxt;

          if (selectedPackArry[2] === "data") {
            depositMethod = "📄";
            depositMethodTxt = "اطلاعات";
          } else if (selectedPackArry[2] === "id") {
            depositMethod = "🆔";
            depositMethodTxt = "آیدی"
          }

          const finalPack = `${selectedPackArry[0]} ${currency}`;

          let sendDepositDataTxt;

          if (selectedPackArry[2] === "data" && selectedPackArry[1] === "gem") {
            sendDepositDataTxt = `لطفا اطلاعات اکانت که شامل:
🔒 * نوع سیو اکانت
🎮 * نام و آیدی اکانت در بازی
📧 * ایمیل اکانت
🔑 * رمز ایمیل اکانت
🔢 * کد پشتیبان
و اطلاعات خود برای پیگیری سفارش که شامل:
📄 * نام و نام خانوادگی
📞 * شماره همراه یا ایمیل
را ارسال کنید.
------------------ RGB GEM -----------------------
نکته: اگر از سیو فیسبوک یا وی کی استفاده میکنید میتوانید به جای ایمیل شماره تلفن خود را نیز وارد کنید.`
          } else if (selectedPackArry[2] === "data" && selectedPackArry[1] === "cp" && !save) {
            sendDepositDataTxt = `لطفا روش شارژ اکانت خود را وارد کنید.`
          } else if (selectedPackArry[2] === "data" && selectedPackArry[1] === "cp" && save) {
            sendDepositDataTxt = `لطفا اطلاعات اکانت که شامل:
🎮 * لول یا نام شما در بازی
📧 * ایمیل
🔑 * رمز
و اطلاعات خود برای پیگیری سفارش که شامل:
📄 * نام و نام خانوادگی
📞 * شماره همراه
را ارسال کنید.`
          } else if (selectedPackArry[2]) {

          }

          return `پک انتخاب شده: ${finalPack}
روش پرداخت: ${depositMethodTxt} ${depositMethod}
${sendDepositDataTxt}`;
        },
        options: () => {
          if (this.selectedPack[1] === "cp") {

            return useMarkup([
              [ 
                { text: "فیسبوک", callback_data: `btn-${this.selectedPack.join("-")}-data-facebook` },
                { text: "اکتیویژن", callback_data: `btn-${this.selectedPack.join("-")}-data-activision` }
              ]
            ])
          } else {
            return undefined
          }
        }
      },
      onsave: () => {

      },
      buy: {
          text: (selectedPack) => {
            const selectedPackArry = selectedPack.split("-");

            selectedPackArry.shift();

            this.selectedPack = selectedPackArry;

            let currency;

            switch(selectedPackArry[1]) {
              case "gem":
                  currency = "جم 💎";
              break
              case "cp":
                  currency = "سی پی 🟨"
              break
              case "uc":
                  currency = "یوسی ⭐"
            }

            const finalPack = `${selectedPackArry[0]} ${currency}`;

            return `
💎 RGB GEM 💎
پک انتخاب شده: ${finalPack}
لطفا روش واریز ${currency.slice(0, currency.length-2)} را انتخاب کنید`;
          },
          options: () => {
            const rawSelectedPack = this.selectedPack.join("-");

            switch(this.selectedPack[1]) {
              case "gem":
                return useMarkup([
                  [
                    { text: "با آیدی 🆔", callback_data: `btn-${rawSelectedPack}-id` },
                    { text: "با اطلاعات 📄", callback_data: `btn-${rawSelectedPack}-data` },
                  ]
                ])
              case "cp":
                return useMarkup([
                  [
                    { text: "با اطلاعات 📄", callback_data: `btn-${rawSelectedPack}-data` },
                  ]
                ])
              case "uc":
                return useMarkup([
                  [
                    { text: "با آیدی 🆔", callback_data: `btn-${rawSelectedPack}-id` }
                  ]
                ])
            }
          }
      },
      gem: {
        text: "لطفا یکی از موارد زیر را برای خرید انتخاب کنید.",
        options: useMarkup([
          [
            { text: "خرید 110 جم فری فایر", callback_data: "btn-110-gem" },
            { text: "خرید 210 جم فری فایر", callback_data: "btn-210-gem" },
          ],
        ]),
      },
      uc: {
        text: "لطفا یکی از موارد زیر را برای خرید انتخاب کنید.",
        options: useMarkup([
          [
            { text: "خرید 60 یوسی پابجی", callback_data: "btn-60-uc" },
            { text: "خرید 120 یوسی پابجی", callback_data: "btn-120-uc" },
          ],
        ]),
      },
      cp: {
        text: "لطفا یکی از موارد زیر را برای خرید انتخاب کنید.",
        options: useMarkup([
          [
            { text: "خرید 60 سی پی کالاف", callback_data: "btn-60-cp" },
            { text: "خرید 120 سی پی کالاف", callback_data: "btn-120-cp" },
          ],
        ]),
      },
    },
  },
};
