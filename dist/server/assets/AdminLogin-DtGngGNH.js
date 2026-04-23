import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useLocation } from "wouter";
import { B as Button } from "../entry-server.js";
import { L as Label, I as Input } from "./label-C2k6QFV2.js";
import { toast } from "sonner";
import { Shield, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import "@trpc/react-query";
import "@trpc/client";
import "react-dom/server";
import "react-helmet-async";
import "superjson";
import "next-themes";
import "@radix-ui/react-tooltip";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
function AdminLogin() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      toast.success("Welcome back, Admin!");
      await queryClient.invalidateQueries();
      setLocation("/admin-saad");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\AdminLogin.tsx:51", className: "min-h-screen bg-background flex flex-col items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\AdminLogin.tsx:52", className: "w-full max-w-md bg-card border border-border rounded-xl shadow-lg p-8", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\AdminLogin.tsx:53", className: "flex flex-col items-center mb-8", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\AdminLogin.tsx:54", className: "w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(Shield, { "data-loc": "client\\src\\pages\\AdminLogin.tsx:55", className: "w-6 h-6 text-primary" }) }),
      /* @__PURE__ */ jsx("h1", { "data-loc": "client\\src\\pages\\AdminLogin.tsx:57", className: "text-2xl font-bold font-heading text-foreground", children: "Admin Portal" }),
      /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\AdminLogin.tsx:58", className: "text-sm text-muted-foreground mt-1 text-center", children: "Sign in to access the Pak Homies Industry dashboard." })
    ] }),
    /* @__PURE__ */ jsxs("form", { "data-loc": "client\\src\\pages\\AdminLogin.tsx:63", onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\AdminLogin.tsx:64", className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\AdminLogin.tsx:65", htmlFor: "email", children: "Email" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            "data-loc": "client\\src\\pages\\AdminLogin.tsx:66",
            id: "email",
            type: "email",
            placeholder: "admin@pakhomiesind.com",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\AdminLogin.tsx:75", className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\AdminLogin.tsx:76", htmlFor: "password", children: "Password" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            "data-loc": "client\\src\\pages\\AdminLogin.tsx:77",
            id: "password",
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\AdminLogin.tsx:85", type: "submit", className: "w-full mt-6", disabled: isLoading, children: [
        isLoading ? /* @__PURE__ */ jsx(Loader2, { "data-loc": "client\\src\\pages\\AdminLogin.tsx:87", className: "w-4 h-4 mr-2 animate-spin" }) : null,
        "Sign In"
      ] })
    ] })
  ] }) });
}
export {
  AdminLogin as default
};
