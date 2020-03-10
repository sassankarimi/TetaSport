
/***** JS توابع کاربردی *****/
import { toast } from 'react-toastify';

// Base 64 تبدیل فایل به 
export function getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        return cb(reader.result);
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}
//کاهش حجک عکس 
export function getResizeImg(img, canvas, x, y) {
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    let MAX_WIDTH = x;
    let MAX_HEIGHT = y;
    let width = img.width; // GET STUCK HERE
    let height = img.height;

    if (width > height) {
        if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
        }
    } else {
        if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
        }
    }
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    let resizeImg = canvas.toDataURL("image/png");
    return resizeImg;
}

// بررسی مسیج های نمایشی به کاربر به صورت از سمت سرور (Toast)
export function handleMSG(code, err) {
    err.then((data) => {
        if (data) {
            switch (code) {
                case 200:
                    break;
                case 201:
                    break;
                case 204:
                    break;
                case 210:
                    if (data.MSG210) {
                        toast.error(data.MSG210, { position: toast.POSITION.TOP_CENTER });
                    }
                    break;
                case 400:
                    if (data.MSG400) {
                        toast.error(data.MSG400, { position: toast.POSITION.TOP_CENTER });
                    }
                    break;
                case 401:
                    if (data.MSG401) {
                        toast.error(data.MSG401, { position: toast.POSITION.TOP_CENTER });
                    }
                    break;
                case 403:
                    if (data.MSG403) {
                        toast.error(data.MSG403, { position: toast.POSITION.TOP_CENTER });
                    }
                    break;
                case 404:
                    if (data.MSG404) {
                        toast.error(data.MSG404, { position: toast.POSITION.TOP_CENTER });
                    }
                    break;
                case 406:
                    if (data.MSG406) {
                        toast.error(data.MSG406, { position: toast.POSITION.TOP_CENTER });
                    }
                    break;
                case 409:
                    if (data.MSG409) {
                        toast.error(data.MSG409, { position: toast.POSITION.TOP_CENTER });
                    }
                    break;
                case 500:
                    if (data.MSG500) {
                        toast.error(data.MSG500, { position: toast.POSITION.TOP_CENTER });
                    }
                    break;
                case 503:
                    if (data.MSG503) {
                        toast.error(data.MSG503, { position: toast.POSITION.TOP_CENTER });
                    }
                    break;
                default:
            }
        }
    })
}

// ساخت عکس برای کراپر
const createImage = url =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', error => reject(error))
        image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
        image.src = url
    })

export async function getCroppedImg(imageSrc, pixelCrop) {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    )

    // Base64 خروجی
    return canvas.toDataURL('image/jpeg');

    //  blob خروجی
    //return new Promise((resolve, reject) => {
    //    canvas.toBlob(file => {
    //        resolve(URL.createObjectURL(file))
    //    }, 'image/jpeg')
    //})
}

// تغییر تم سایت
export function whichTheme(w) {
    switch (w) {
        case 1:
            localStorage.removeItem('theme');
            window.location.reload();
            break;
        case 2:
            localStorage.setItem('theme', 'dark');
            window.location.reload();
            break;
        default:
            localStorage.removeItem('theme');
            window.location.reload();
    }
}

