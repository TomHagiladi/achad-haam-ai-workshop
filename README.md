# סדנת AI למורים — חט"ב אחד העם פתח תקווה

אפליקציה מלווה לסדנה של תום הגלעדי, אפריל 2026.
מציעה למורים שלושה מסלולי התנסות עצמית בכלי AI חדשים, עם מדריך צעד-אחר-צעד ורעיונות לכיתה.

**נושאי הסדנה:**
1. **ChatGPT Images 2.0** — מודל התמונות החדש של OpenAI (חינם)
2. **Gemini Canvas** — Vibe Coding, בניית אפליקציות בלי קוד (חינם)
3. **Gemini Gems** — עוזרי AI אישיים (חינם מ-2026)

---

## מבנה הקבצים

```
achad-haam-ai-workshop/
├── index.html          # ה-SPA — שלד HTML של 4 המסכים
├── styles.css          # כל ה-CSS (אסתטיקת editorial-chalk)
├── content.js          # כל התוכן של 3 המסלולים — כאן עורכים תוכן!
├── script.js           # רוטר hash, רינדור, copy, פילטרים
├── assets/
│   └── logo.png        # הלוגו של תום
└── README.md           # קובץ זה
```

**טיפ עריכה:** רוצה לשנות תוכן? תערוך את `content.js` בלבד. זה הקובץ היחיד שצריך לגעת בו לעדכוני תוכן.

---

## הרצה מקומית

```bash
cd "c:/Users/tomha/claude code/workshops/achad-haam-ai-workshop"
python -m http.server 8765
```

ואז פותחים בדפדפן: <http://localhost:8765/>

---

## דיפלוי ל-GitHub Pages

### אופציה 1 — דרך הסקיל `/github` (מומלץ)

```
/github
```

תאמר ל-Claude:
> תיצור repo ציבורי בשם `achad-haam-ai-workshop`, תדחוף את כל הקבצים, ותפעיל GitHub Pages על branch `main` (root).

### אופציה 2 — ידני

```bash
cd "c:/Users/tomha/claude code/workshops/achad-haam-ai-workshop"
git init
git add .
git commit -m "Initial workshop companion app"
gh repo create achad-haam-ai-workshop --public --source=. --push
gh api -X POST repos/TomHagiladi/achad-haam-ai-workshop/pages \
  -f source.branch=main -f source.path=/
```

ה-URL הסופי: `https://tomhagiladi.github.io/achad-haam-ai-workshop/`

### יצירת QR code

```bash
# אם יש לך qrencode מותקן
qrencode -o qr.png -s 12 "https://tomhagiladi.github.io/achad-haam-ai-workshop/"
```

או דרך Bitly/קצרל לקצר את הקישור, ולהשתמש ב-<https://www.qr-code-generator.com>.

---

## עדכון תוכן בעתיד

כל התוכן נמצא ב-`content.js` במבנה אחיד:

```js
TRACKS = {
  images: { eyebrow, title, subtitle, meta, intro, steps, ideas, sources },
  canvas: { ... },
  gems:   { ... },
}
```

**מבנה צעד (step):**
```js
{
  title: "כותרת הצעד",
  text: "טקסט הצעד עם <strong>HTML</strong> מותר",
  prompt: "פרומפט מומלץ להעתקה (אופציונלי)",
  tip: "טיפ צהוב (אופציונלי)"
}
```

**מבנה רעיון (idea):**
```js
{
  title: "שם הרעיון",
  desc: "תיאור קצר",
  grade: ["יסודי", "חט\"ב"],   // לפילטר
  subject: "מתמטיקה",            // לפילטר
  prompt: "טעימה לפרומפט"
}
```

---

## נגישות

האתר עומד בתקנה 35 לשוויון זכויות לאנשים עם מוגבלות:
- ניגודיות AA לפחות
- ניווט במקלדת מלא (`:focus-visible`)
- `aria-label` לכל אייקון
- `prefers-reduced-motion` מכובד
- `skip-link` לתוכן הראשי
- `alt` לכל תמונה
- מבנה היררכי תקין של כותרות (h1 → h2 → h3)

---

## טכנולוגיות

- **HTML5 + CSS3 + Vanilla JS** — אין framework, אין build step
- **Hash routing** — ניווט פנים-אפליקציה דרך `location.hash`
- **Google Fonts** — Suez One (תצוגה) + Assistant (גוף) + JetBrains Mono (קוד)
- **Static hosting** — GitHub Pages

---

נבנה בידי תום הגלעדי לסדנת AI בחט"ב אחד העם פתח תקווה — אפריל 2026.
