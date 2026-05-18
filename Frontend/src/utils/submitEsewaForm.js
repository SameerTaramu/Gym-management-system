export const submitEsewaForm = (payload) => {
  const form = document.createElement("form");
  form.method = "POST";

form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
  Object.entries(payload).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};