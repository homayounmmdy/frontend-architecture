import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { OrderLineItemsTable } from "@commerceos/shared/components/orders/order-line-items-table";
import type { Order } from "@commerceos/shared/domain/commerce/orders.types";

interface OrderHistoryOrderLinkProps {
  order: Order;
}

const HOVER_DELAY_MS = 1000;

export function OrderHistoryOrderLink({ order }: OrderHistoryOrderLinkProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<number | null>(null);

  function clearHoverTimer() {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function startHoverTimer() {
    clearHoverTimer();
    timerRef.current = window.setTimeout(() => {
      setIsOpen(true);
      timerRef.current = null;
    }, HOVER_DELAY_MS);
  }

  function closePopover() {
    clearHoverTimer();
    setIsOpen(false);
  }

  useEffect(() => () => clearHoverTimer(), []);

  return (
    <div className="relative inline-flex" onMouseEnter={startHoverTimer} onMouseLeave={closePopover}>
      <Link to="/orders/$orderId" params={{ orderId: order.id }} className="font-medium text-primary hover:underline">
        {order.orderNumber}
      </Link>

      {isOpen ? (
        <div className="absolute left-0 top-full z-20 mt-2 w-[30rem] rounded-lg border bg-card p-4 shadow-panel">
          <div className="mb-3 text-sm font-medium">Products in {order.orderNumber}</div>
          <div className="max-h-72 overflow-auto">
            <OrderLineItemsTable items={order.lineItems} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
