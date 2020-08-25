const puppeteer = require('puppeteer');
const dotenv = require("dotenv")
dotenv.config()
const Tenant = process.env.TENANT;
const UserName = process.env.USER_NAME;
const Password = process.env.PASSWORD;
var RetryCount = 3;

(async function run() {
    console.log("Tenant", Tenant.length)
    console.log("UserName", UserName.length)
    console.log("Password", Password.length)
    if (Tenant === "" || UserName === "" || Password === "" ) {
        console.log("请输入");
        process.exit(1);
        return;
    }
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox','--lang=zh-CN,zh']});
    const page = await browser.newPage();

    console.log("等待页面加载 " );
    try {
        //await page.goto("https://www.oracle.com/cloud/sign-in.html");
        await page.goto("https://console.ap-tokyo-1.oraclecloud.com");
    } catch (e) {
    	if(RetryCount != 0) { console.log("等待重试。。。 " ); RetryCount--; run(); }
    	else {
    		throw new Error('请求页面超时'+e);
    		return;
    	}
    }
    await page.waitFor(10000);
    await page.waitFor("#tenant");
    console.log("输入Cloud tenant");
    await page.type("#tenant", Tenant);
    let inputTypeSubmit = await page.$('input[type=submit]');
    console.log("点击Continue");
    await inputTypeSubmit.click();
    console.log("等待下一页加载");
    try {
    	await page.waitFor(30000);
    	await page.waitFor("#username",{timeout:3000});
    } catch (e){
    	if(RetryCount != 0) { RetryCount--; run(); }
    	else {
    		throw new Error('获取下一页超时'+e);
    		return;
    	}
    }
    
	await page.waitFor("#username");
    console.log("输入用户名");
    await page.type("#username", UserName);

    await page.waitFor("#password");
    console.log("输入密码");
    await page.type("#password", Password);

    console.log("点击登录");
    await page.click("#submit-native");

    try {
        await page.waitFor("#console-content-wrapper");
        console.log("登录成功")
        page.close();
        process.exit(0);

    } catch (e) {
        console.log("登录失败")
        page.close();
        process.exit(1);

    }

})();
