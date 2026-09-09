# Black Friday Landing — The Marketing Clinic

Лендинг за Black Friday рекламите. Една самостоятелна HTML страница, без билд стъпка и без зависимости.

- `index.html` — цялата страница (CSS и JS са вградени, шрифтовете идват от Google Fonts)
- `.nojekyll` — казва на GitHub Pages да не минава файловете през Jekyll
- Meta Pixel: `1351953120302144` (PageView при зареждане, Lead при успешна заявка, с Advanced Matching и eventID за CAPI дедупликация)
- Лийдовете отиват в същия Google Apps Script като главния сайт; `service` е „Black Friday екшън план", `source` е „Landing /ads black-friday"
- Страницата е `noindex, nofollow` — нарочно, защото се пълни с платен трафик

## Качване в GitHub

```bash
cd път/до/black-friday
git init -b main
git add .
git commit -m "Black Friday landing"
```

С GitHub CLI (`gh auth login` първия път):

```bash
gh repo create black-friday --public --source=. --push
```

Или ръчно: създайте празно repo в github.com (без README), после:

```bash
git remote add origin https://github.com/ПОТРЕБИТЕЛ/black-friday.git
git push -u origin main
```

## Пускане на GitHub Pages

Settings → Pages → Source: **Deploy from a branch** → Branch: `main`, папка `/ (root)` → Save.

След минута страницата е на `https://ПОТРЕБИТЕЛ.github.io/black-friday/`.

## Как да стане marketing-clinic.com/black-friday

GitHub Pages не може само да сложи repo на подпапка от чужд домейн — един домейн сочи към един Pages сайт. Двата работещи варианта:

**1. През хостинга на главния сайт (най-просто).**
Качете `index.html` в папка `black-friday/` на сървъра/проекта на marketing-clinic.com. GitHub repo-то остава източник на истината, а страницата се сервира от вашия хостинг. Работи веднага и без допълнителни правила.

**2. През Cloudflare (домейнът вече минава през Cloudflare).**
Оставяте страницата на GitHub Pages и добавяте Worker, който сервира `/black-friday` от нея:

```js
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/black-friday' || url.pathname.startsWith('/black-friday/')) {
      const target = 'https://ПОТРЕБИТЕЛ.github.io' + url.pathname.replace(/\/$/, '') + '/';
      return fetch(target, request);
    }
    return fetch(request);
  }
}
```

Workers → Create → поставяте кода → Add route: `marketing-clinic.com/black-friday*`.

**Алтернатива, ако не искате нито едното:** отделен поддомейн. В repo-то се добавя файл `CNAME` със съдържание `bf.marketing-clinic.com`, а в DNS се прави CNAME запис към `ПОТРЕБИТЕЛ.github.io`. Тръгва за минути.

## Промени

Редактира се само `index.html`, после:

```bash
git add index.html && git commit -m "Copy update" && git push
```

Pages се обновява до около минута.
