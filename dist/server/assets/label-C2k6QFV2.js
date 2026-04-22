import { jsx, jsxs } from "react/jsx-runtime";
import { c as cn } from "../entry-server.js";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import * as React from "react";
import { useRef } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
const DialogCompositionContext = React.createContext({
  isComposing: () => false,
  setComposing: () => {
  },
  justEndedComposing: () => false,
  markCompositionEnd: () => {
  }
});
const useDialogComposition = () => React.useContext(DialogCompositionContext);
function Dialog({
  ...props
}) {
  const composingRef = React.useRef(false);
  const justEndedRef = React.useRef(false);
  const endTimerRef = React.useRef(null);
  const contextValue = React.useMemo(
    () => ({
      isComposing: () => composingRef.current,
      setComposing: (composing) => {
        composingRef.current = composing;
      },
      justEndedComposing: () => justEndedRef.current,
      markCompositionEnd: () => {
        justEndedRef.current = true;
        if (endTimerRef.current) {
          clearTimeout(endTimerRef.current);
        }
        endTimerRef.current = setTimeout(() => {
          justEndedRef.current = false;
        }, 150);
      }
    }),
    []
  );
  return /* @__PURE__ */ jsx(DialogCompositionContext.Provider, { "data-loc": "client\\src\\components\\ui\\dialog.tsx:50", value: contextValue, children: /* @__PURE__ */ jsx(DialogPrimitive.Root, { "data-loc": "client\\src\\components\\ui\\dialog.tsx:51", "data-slot": "dialog", ...props }) });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Portal, { "data-loc": "client\\src\\components\\ui\\dialog.tsx:65", "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Overlay,
    {
      "data-loc": "client\\src\\components\\ui\\dialog.tsx:79",
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
DialogOverlay.displayName = "DialogOverlay";
function DialogContent({
  className,
  children,
  showCloseButton = true,
  onEscapeKeyDown,
  ...props
}) {
  const { isComposing } = useDialogComposition();
  const handleEscapeKeyDown = React.useCallback(
    (e) => {
      const isCurrentlyComposing = e.isComposing || isComposing();
      if (isCurrentlyComposing) {
        e.preventDefault();
        return;
      }
      onEscapeKeyDown?.(e);
    },
    [isComposing, onEscapeKeyDown]
  );
  return /* @__PURE__ */ jsxs(DialogPortal, { "data-loc": "client\\src\\components\\ui\\dialog.tsx:122", "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsx(DialogOverlay, { "data-loc": "client\\src\\components\\ui\\dialog.tsx:123" }),
    /* @__PURE__ */ jsxs(
      DialogPrimitive.Content,
      {
        "data-loc": "client\\src\\components\\ui\\dialog.tsx:124",
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        onEscapeKeyDown: handleEscapeKeyDown,
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxs(
            DialogPrimitive.Close,
            {
              "data-loc": "client\\src\\components\\ui\\dialog.tsx:135",
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsx(XIcon, { "data-loc": "client\\src\\components\\ui\\dialog.tsx:139" }),
                /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\ui\\dialog.tsx:140", className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-loc": "client\\src\\components\\ui\\dialog.tsx:150",
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-loc": "client\\src\\components\\ui\\dialog.tsx:160",
      "data-slot": "dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Title,
    {
      "data-loc": "client\\src\\components\\ui\\dialog.tsx:176",
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function usePersistFn(fn) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const persistFn = useRef(null);
  if (!persistFn.current) {
    persistFn.current = function(...args) {
      return fnRef.current.apply(this, args);
    };
  }
  return persistFn.current;
}
function useComposition(options = {}) {
  const {
    onKeyDown: originalOnKeyDown,
    onCompositionStart: originalOnCompositionStart,
    onCompositionEnd: originalOnCompositionEnd
  } = options;
  const c = useRef(false);
  const timer = useRef(null);
  const timer2 = useRef(null);
  const onCompositionStart = usePersistFn((e) => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (timer2.current) {
      clearTimeout(timer2.current);
      timer2.current = null;
    }
    c.current = true;
    originalOnCompositionStart?.(e);
  });
  const onCompositionEnd = usePersistFn((e) => {
    timer.current = setTimeout(() => {
      timer2.current = setTimeout(() => {
        c.current = false;
      });
    });
    originalOnCompositionEnd?.(e);
  });
  const onKeyDown = usePersistFn((e) => {
    if (c.current && (e.key === "Escape" || e.key === "Enter" && !e.shiftKey)) {
      e.stopPropagation();
      return;
    }
    originalOnKeyDown?.(e);
  });
  const isComposing = usePersistFn(() => {
    return c.current;
  });
  return {
    onCompositionStart,
    onCompositionEnd,
    onKeyDown,
    isComposing
  };
}
function Input({
  className,
  type,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  ...props
}) {
  const dialogComposition = useDialogComposition();
  const {
    onCompositionStart: handleCompositionStart,
    onCompositionEnd: handleCompositionEnd,
    onKeyDown: handleKeyDown
  } = useComposition({
    onKeyDown: (e) => {
      const isComposing = e.nativeEvent.isComposing || dialogComposition.justEndedComposing();
      if (e.key === "Enter" && isComposing) {
        return;
      }
      onKeyDown?.(e);
    },
    onCompositionStart: (e) => {
      dialogComposition.setComposing(true);
      onCompositionStart?.(e);
    },
    onCompositionEnd: (e) => {
      dialogComposition.markCompositionEnd();
      setTimeout(() => {
        dialogComposition.setComposing(false);
      }, 100);
      onCompositionEnd?.(e);
    }
  });
  return /* @__PURE__ */ jsx(
    "input",
    {
      "data-loc": "client\\src\\components\\ui\\input.tsx:53",
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      onCompositionStart: handleCompositionStart,
      onCompositionEnd: handleCompositionEnd,
      onKeyDown: handleKeyDown,
      ...props
    }
  );
}
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    LabelPrimitive.Root,
    {
      "data-loc": "client\\src\\components\\ui\\label.tsx:11",
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
export {
  Dialog as D,
  Input as I,
  Label as L,
  DialogContent as a,
  DialogHeader as b,
  DialogTitle as c,
  DialogFooter as d,
  useComposition as e,
  useDialogComposition as u
};
