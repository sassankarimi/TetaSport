// Resend Verify Code Functions
resendCode = () => {
    let count = 15;
    let counter = setInterval(timer, 1000); //every 1 second
    function timer() {
        count = count - 1;
        if (count <= 0) {
            clearInterval(counter);
            document.getElementById('mobileBtnClick').click();
            document.getElementById("timer").innerHTML = '<span onClick="resendCode()" style=\'text-align: right;cursor:pointer\'>ارسال مجدد کد</span>';
            //do action here = resend code
            return;
        }
        document.getElementById("timer").innerHTML = count + " ثانیه تا ارسال مجدد کد";
    }
};
resendCodeForget = () => {
    let count = 15;
    let counter = setInterval(timerForget, 1000); //every 1 second
    function timerForget() {
        count = count - 1;
        if (count <= 0) {
            clearInterval(counter);
            document.getElementById('forgetMyPassword').click();
            document.getElementById("timer-forget").innerHTML = '<span onClick="resendCodeForget()" style=\'text-align: right; cursor: pointer\'>ارسال مجدد کد</span>';
            //do action here
            return;
        }
        document.getElementById("timer-forget").innerHTML = count + " ثانیه تا ارسال مجدد کد";
    }
};


