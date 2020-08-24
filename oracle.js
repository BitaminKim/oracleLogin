const puppeteer = require('puppeteer');
const dotenv = require("dotenv")
dotenv.config()
const Tenant = process.env.TENANT;
const UserName = process.env.USER_NAME;
const Password = process.env.PASSWORD;

(async () => {
    console.log("Tenant", Tenant.length)
    console.log("UserName", UserName.length)
    console.log("Password", Password.length)
    if (Tenant === "" || UserName === "" || Password === "" ) {
        console.log("请输入");
        process.exit(1);
        return
    }
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox','--lang=zh-CN,zh']});
    const page = await browser.newPage();

    console.log("等待页面加载 " );
    try {
        await page.goto("https://www.oracle.com/cloud/sign-in.html");
    } catch (e) {
        throw new Error('请求页面超时'+e);
    }
    
    await page.waitFor("#cloudAccountName");
    console.log("输入tenant");
    await page.type("#cloudAccountName", Tenant);
    let inputTypeSubmit = await page.$('#cloudAccountButton');
    console.log("点击确定");
    await inputTypeSubmit.click();
    console.log("等待下一页加载");
    await page.waitFor(30000);
    
    await page.waitFor("#idcs-signin-basic-signin-form-username");
    console.log("输入用户名");
    await page.type("#idcs-signin-basic-signin-form-username", UserName);

    await page.waitFor(".oj-inputpassword-input");
    console.log("输入密码");
    await page.type(".oj-inputpassword-input", Password);

    console.log("点击登录");
    await page.click(".oj-button-label");

    try {
        await page.waitFor(".oracle-logo__icon")
        console.log("登录成功")
        page.close();
        process.exit(0);

    } catch (e) {
        console.log("登录失败")
        page.close();
        process.exit(1);

    }

})();
