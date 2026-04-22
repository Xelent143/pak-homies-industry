import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/pages/layouts/AdminLayout";
import { MessageSquare, Package, ShoppingBag, Users } from "lucide-react";

export default function AdminCustomers() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            This section is reserved for customer profiles and account history. For now, customer activity lives across orders and inquiries.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-gold">
            <Users className="h-6 w-6" />
          </div>
          <h2 className="font-condensed text-lg font-bold uppercase tracking-wider text-foreground">
            Customer Hub Coming Next
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            You can already manage real customer activity through recent orders, quote inquiries, and product drafts. This route now stays inside the admin panel instead of dropping into a 404 page.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/admin-saad/orders">
              <Button variant="outline">
                <ShoppingBag className="mr-2 h-4 w-4" />
                View Orders
              </Button>
            </Link>
            <Link href="/admin-saad/inquiries">
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                View Inquiries
              </Button>
            </Link>
            <Link href="/admin-saad/products">
              <Button className="bg-gold text-black hover:bg-gold-light">
                <Package className="mr-2 h-4 w-4" />
                View Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
