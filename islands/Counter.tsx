import type { Signal } from "@preact/signals";
import { useSignal } from "@preact/signals";

interface CounterProps {
  count: Signal<number>;
}

function Button(props: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={props.onClick}
      class="bg-purple-500 border rounded text-white p-1"
    >
      {props.label}
    </button>
  );
}
export default function Counter(props: CounterProps) {
  const fries = { name: "Fries", price: 1.00 };
  const menuItems = [
    { name: "Meatball Sub", price: 3.75 },
    { name: "WASD Soup", price: 2.75 },
    { name: "Raspberry Pi(e)", price: 3.14 },
    fries,
    { name: "Soda", price: 1.50 },
    { name: "Hello World Combo: Meatball sub, fries, and soda", price: 10 },
  ];

  const promoCodes = [
    { code: "VETERAN30", value: 0.3 },
    { code: "FE_WORKSHOP", value: 0.15 },
    { code: "LAWTONSMEAL", value: 0.5 },
    { code: "KERNEY666", value: 0.41 },
  ];

  const cart = useSignal<Array<typeof menuItems[number]>>([]);
  const showCart = useSignal<boolean>(false);
  const appliedCodes = useSignal<Array<typeof promoCodes[number]>>([]);
  const currentCode = useSignal<string>("");
  const promoCodeError = useSignal<string>("");

  return (
    <div class="w-full flex flex-col">
      <div class="place-self-end">
        <Button
          onClick={() => showCart.value = !showCart.value}
          label={`Cart (${cart.value.length})`}
        />
      </div>
      {showCart.value
        ? (
          <div class="gap-8 py-6 w-full">
            {cart.value.map((item, index) => (
              <div class="flex place-content-between">
                <h4>{item.name}</h4>
                <div class="flex gap-4">
                  <p>{item.price}</p>
                  <Button
                    onClick={() => {
                      cart.value.splice(index, 1);
                      cart.value = [...cart.value];
                    }}
                    label="Remove from Cart"
                  />
                </div>
              </div>
            ))}
            {!cart.value.some((item) => item.name === fries.name) && (
              <div class="flex place-content-between">
                <p>
                  It looks like you forgot to add some fries would you like
                  some?
                </p>
                <Button
                  onClick={() => cart.value = [...cart.value, fries]}
                  label="Add Fries"
                />
              </div>
            )}
            <div class="flex">
              <label htmlFor="promoCodes">Promo Codes</label>
              <input
                id="promoCodes"
                type="text"
                value={currentCode}
                onChange={(event) =>
                  currentCode.value = event.currentTarget.value}
              />
              <Button
                onClick={() => {
                  const code = promoCodes.find((promoCode) =>
                    promoCode.code === currentCode.value.toUpperCase()
                  );
                  if (!code) {
                    promoCodeError.value = "Code Not Found";
                  } else {
                    if (
                      appliedCodes.value.some((promoCode) =>
                        promoCode.code === code.code
                      )
                    ) {
                      promoCodeError.value = "Code Already Applied";
                    } else {
                      appliedCodes.value = [...appliedCodes.value, code];
                      currentCode.value = "";
                      promoCodeError.value = "";
                    }
                  }
                }}
                label="Apply Code"
              />
              {!!promoCodeError.value && (
                <h1 class="text-red-500">{promoCodeError.value}</h1>
              )}
            </div>
            {appliedCodes.value.map((promoCode) => (
              <div class="flex w-56 place-content-between">
                <p>{promoCode.code}</p>
                <p>{promoCode.value}</p>
              </div>
            ))}
            <p>
              Total Price: ${cart.value.reduce(
                (value, item) => value += item.price,
                0,
              ) * (1 - appliedCodes.value.reduce((value, promoCode) =>
                value += promoCode.value, 0))}
            </p>
          </div>
        )
        : (
          <div class="gap-8 py-6 w-full">
            {menuItems.map((item) => (
              <div class="flex place-content-between">
                <h4>{item.name}</h4>
                <div class="flex gap-4">
                  <p>{item.price}</p>
                  <Button
                    onClick={() => cart.value = [...cart.value, item]}
                    label="Add to Cart"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
