## 2026-05-21 - [Native Dialog Backdrop Clicks and Accessibility]
**Learning:** Native `<dialog>` elements do not automatically close when their backdrop is clicked, which is a common user expectation. Also, screen readers require explicit `aria-labelledby` on the dialog pointing to its title for proper context.
**Action:** Always add `onclick="event.target === this && this.close()"` to native `<dialog>` elements to easily support backdrop clicks, and ensure `aria-labelledby` is linked to the modal's heading.
