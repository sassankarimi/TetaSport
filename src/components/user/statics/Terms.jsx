﻿import React, { Component, Fragment } from 'react';
import ReactTooltip from 'react-tooltip';

export default class Terms extends Component {
    static displayName = Terms.name;

    render() {
        // تایتل صفحه
        document.getElementsByTagName("title")[0].innerHTML = `تتا اسپرت | شرایط استفاده از سرویس`;
        return (
            <Fragment>
                <ReactTooltip place="top" type="dark" effect="solid" />
                <div className={`${localStorage.getItem('theme') === 'dark' ? 'static-container--dark' : 'static-container'}`}>
                    <h1 className='terms-h1'>شرایط استفاده</h1>
                    <h3 className='terms-h3'>به وبسایت تتا اسپورت خوش آمدید</h3>
                    <p className='terms-txt'>                      
ما به برگزارکنندگان لیگ های فوتبال و فوتسال کمک می‌کنیم که رقابت هایی برای شرکت¬کنندگان ساخته و آن را مدیریت کنند و همچنین به بازیکنان نیز در پیدا کردن لیگ¬ها، تیم‌ها و محک زدن خود در رقابت‌ها کمک می کنیم. تتا اسپورت خود را متعهد می‌داند تا فضایی سالم و امن را برای کاربران خود ایجاد نماید و در حفظ آن کوشا باشد.عضویت در سایت و ثبت نام در رویداد به منزله مطالعه و قبول شرایط ثبت نام و عضویت و قوانین و مقررات مربوطه است.
استفاده از تتااسپورت و تغییرات
با ورود به تتااسپورت و آغاز استفاده از آن، می‌پذیرید که عملکرد شما در چارچوب «شرایط استفاده» و «حریم خصوصی» خواهد بود. از آن‌جا که تتااسپورت همواره در حال به‌روزرسانی است، امکان دارد که بخشی از خدمات و امکانات آن به مرور زمان تغییر کند لذا این حق را دارد که با توجه به این تغییرات، قوانین خود را تغییر دهد. هر چند ممکن است تغییرات مهم و اساسی را از طریق پیامک یا اخبار خودسایت به اطلاع کاربران خود برساند، اما به طور کلی کاربر موظف است که همواره به قوانین و تغییرات آن توجه داشته باشد. همچنین کاربر متعهد می‌شود هیچ‌گاه از سرویس‌های تتااسپورت به صورتی که به تتااسپورت یا شرکای آن صدمه‌ای وارد کند یا منجر به عدم حفظ شهرت کاری و اعتبار تتااسپورت شود استفاده نکند.
محدوده مسئولیت تتا اسپورت
تتااسپورت خود را موظف به رعایت قوانین جمهوری اسلامی ایران می‌داند. از این رو، تتااسپورت می‌تواند محتوای منتشر شده توسط کاربران را بررسی کرده و در صورت تعارض با قوانین جمهوری اسلامی ایران و بالاخص «فهرست مصادیق محتوای مجرمانه» تهیه شده توسط کارگروه تعیین مصادیق محتوای مجرمانه آن را حذف نماید و یا مانع از نمایش آن شود. 
دسترسی ها و اکانت ها در تتااسپورت
جهت استفاده از هرنوع سرویسی در تتا اسپورت شما نیاز به ساخت یک اکانت دارید. بدیهی است هرگونه تغییری در اطلاعات شما در سایر رویدادها نیز اعمال می¬شود.ضمنا مسئولیت هرگونه مغایرت مشخصات شما با هویت واقعی عضو بر عهده خود افراد بوده و تتااسپورت هیچ‌گونه مسئولیتی نسبت به مغایرت‌های احتمالی ندارد.
محفوظ نگه داشتن نام کاربری و رمز عبور جزو مسئولیت های کاربر می¬باشد. چنانچه نام¬کاربری یا رمزعبور خود را فراموش کردید، می‌توانید برای ثبت نام مجدد و اخذ کلمه عبور جدید اقدام کنید.
قوانین مربوط به نام اکانت‌ها در تتااسپورت
 چنانچه شما در تتااسپورت، خود را با نام یک شخصیت حقیقی یا حقوقی دیگر معرفی نمایید، یا در صورتی که معلوم شود بدون اجازه از نام یا اعتبار شخص دیگری سوءاستفاده کرده‌اید، مسئولیت این کار بر عهده شما خواهد بود. با محرز شدن چنین تخلفی، تتااسپورت می‌تواند نسبت به توقف ارائه خدمات به شما اقدام نماید و در صورت نیاز برای پیگیری حقوقی و کیفری موضوع، همکاری‌های لازم را با نهادها و ارگان‌های مربوطه داشته باشد.
نام کاربری‌های زیر قابل انتخاب نیست:
1.	متعلق به شخص یا هویت دیگری باشد که به قصد جعل هویت در سایت ساخته شده باشد.
2.	استفاده تکی یا ترکیب کلمات مبتذل، افترا آمیز، هجوآمیز، ناپسند، تنفرانگیز، نژاد پرستانه یا قومیتی.
3.	متعلق به حقوق فرد یا هویتی باشد که به طور رسمی از آن اجازه نگرفته شده باشد
4.	متعلق به فرد مشهور، مذهبی یا فرهنگی باشد.
5.	بخشی از یک نام تجاری ثبت شده باشد.
6.	متعلق به مذهب یا فرقه خاصی باشد.
7.	مربوط به مواد مخدر، مسائل جنسی، مشروبات الکلی یا فعالیت‌های جنایتکارانه باشد.
8.	تشکیل شده از یک جمله کامل یا بخشی از آن باشد.
9.	حروف بی‌ربط، در هم و بدون معنی باشد.
قوانین کاربری زیر مرتبط با استفاده شما از خدمات است و شما موافقت می‌کنید نه خودتان اعمال زیر را انجام داده و نه به طور مستقیم یا غیرمستقیم به دیگران اجازه دهید:
1.	نقض هر قانون یا قرارداد قابل اجرا یا استفاده از خدمات در راستای اهداف غیرقانونی
2.	ساخت، توزیع یا استفاده از هرگونه نرم‌افزارهایی مانند چیت، مادها، هک یا هرچیزی که طراحی شده تا   مسابقات را تغییر دهد
3.	ارائه هرگونه اطلاعات شخصی غلط.
4.	ارائه هرگونه اظهارنظر دروغ غلط یا غیردقیق
5.	استفاده از زبان تهدید، سوءاستفاده، آزاردهنده، افتراآمیز، جعلی، جنجالی یا غیرقانونی
6.	محدود کردن یا منع دسترسی سایر کاربران بوسیله هک کردن یا به هر طریقی دیگر.
7.	دور زدن هرگونه امنیت یا محافظ رمزکاربری در خدمات
8.	استفاده از خدمات برای آسیب به افراد زیر سن قانونی
9.	جمع‌آوری هرگونه اطلاعات بازدیدکنندگان یا کاربران بدون اظهار رضایت آنها
تتا اسپورت هیچ ضمانتی در دخالت در استفاده شما از خدمات نکرده و شما تتااسپورت را مسئول این دخالت‌ها نمی‌دانید.
سیستم پرداخت
استفاده از بعضی از جنبه های خدمات نیازمند پرداخت مبلغی است شما موافقت می کنید برای دسترسی به این بخش‌های خدمات تمام مبالغ را به طور کامل پرداخت کرده و در حین پرداخت تمامی اطلاعات خواسته شده را به درستی وارد نمایید همچنین شما متعهد می شوید حق قانونی استفاده از روش پرداخت مورد نظر را دارید.
تتااسپورت حق دارد:
•	این بخشهای خدمات را محدود کرده یا ارائه آن را در هر زمان خاتمه دهد.





                    </p>
                </div>
            </Fragment>
        );
    }
}