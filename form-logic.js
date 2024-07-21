const date = document.getElementById("pickup_date");
if (date != null) {
  const today = new Date().toISOString().split("T")[0];
  date.value = today;
  date.min = today;
}
const addOptions = (select, min, max) => {
  for (var i = min; i <= max; i++) {
    var opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = i;
    select.appendChild(opt);
  }
};



const sourdoughPrice = 8;
const pretzelsPrice = 3;
const hefezopfPrice = 7;

const onSubmit = async () => {
  console.log("submitting");

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const pickupDate = document.getElementById("pickup_date").value;
  const sourdough = document.getElementById("sourdough_select").value;
  const pretzels = document.getElementById("pretzels_select").value;
  const hefezopf = document.getElementById("hefezopf_select").value;
  

  const response = await fetch("/api/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      pickupDate,
      sourdough,
      pretzels,
      hefezopf,
    }),
  });

  if (response.ok) {
    alert("Order placed successfully!");
  } else {
    alert("Failed to place order");
  }
};
const test = () => console.log("test");
const form = document.getElementById("order-form");

const sourdough = document.getElementById("sourdough_select");
const pretzels = document.getElementById("pretzels_select");
const hefezopf = document.getElementById("hefezopf_select");

addOptions(sourdough, 0, 3);
addOptions(pretzels, 0, 10);
addOptions(hefezopf, 0, 3);

const onSelect = () => {
  const numSourdough = sourdough.value;
  const numPretzels = pretzels.value;
  const numHefezopf = hefezopf.value;

  const totalPrice = sourdoughPrice * numSourdough + pretzelsPrice * numPretzels + hefezopfPrice * numHefezopf;
  document.getElementById("total-price").textContent = `$${totalPrice}`;
};
sourdough.addEventListener("change", onSelect);
pretzels.addEventListener("change", onSelect);
hefezopf.addEventListener("change", onSelect);
const totalPriceEl = document.getElementById("total-price");

const overlay = document.getElementById("overlay");

const preOrderButton = document.getElementById("pre-order-button");
preOrderButton.addEventListener("click", () => {
  overlay.classList.remove("hidden");
});

const closeButton = document.getElementById("close-button");
closeButton.addEventListener("click", () => {
  overlay.classList.add("hidden");
});
