# Ebook Store Platform

Dr. Tun Myat Win ၏ ကျန်းမာရေးနှင့် ဗဟုသုတဆိုင်ရာ စာအုပ်များကို ဝယ်ယူဖတ်ရှုနိုင်သော Platform ဖြစ်ပါသည်။

## နည်းပညာများ (Tech Stack)
* **Frontend:** Next.js (App Router)
* **Backend Database:** NocoDB
* **Infrastructure:** Docker & Nginx Proxy Manager

## ပါဝင်သော Features များ
* စာအုပ်စာရင်းများကို NocoDB မှ တိုက်ရိုက်ချိတ်ဆက်ပြသခြင်း။
* Price 0 ဖြစ်ပါက တိုက်ရိုက် Download/Read ပြုလုပ်နိုင်ခြင်း။
* Price ရှိပါက Checkout Page သို့ သွားရောက်၍ ငွေလွှဲ Screenshot ပေးပို့ဝယ်ယူနိုင်ခြင်း။
* Responsive Design (Mobile & Desktop အဆင်ပြေစေရန် ဖန်တီးထားပါသည်)။

## စတင်အသုံးပြုပုံ
1. `docker compose up -d --build`
2. Frontend ကို `http://localhost:3000` တွင် ကြည့်ရှုနိုင်ပါသည်။
