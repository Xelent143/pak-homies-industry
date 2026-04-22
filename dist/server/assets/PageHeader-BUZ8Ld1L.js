import { jsx, jsxs } from "react/jsx-runtime";
function PageHeader({ eyebrow, title, subtitle }) {
  return /* @__PURE__ */ jsx("section", { "data-loc": "client\\src\\components\\PageHeader.tsx:9", className: "bg-[#1A1A1A] text-white", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\components\\PageHeader.tsx:10", className: "container-page py-20 md:py-28", children: [
    eyebrow && /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\components\\PageHeader.tsx:12", className: "ribbon-text text-[#5A5DCB] mb-4", children: eyebrow }),
    /* @__PURE__ */ jsx("h1", { "data-loc": "client\\src\\components\\PageHeader.tsx:14", className: "font-display text-4xl md:text-6xl text-white max-w-4xl leading-[1.05]", children: title }),
    subtitle && /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\components\\PageHeader.tsx:18", className: "mt-6 text-lg text-white/70 max-w-2xl", children: subtitle })
  ] }) });
}
export {
  PageHeader as P
};
