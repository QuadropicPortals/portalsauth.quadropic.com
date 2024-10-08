import { startRegistration } from "@simplewebauthn/browser";

export const registerPasskey = async (
  setError: (error: string | null) => void
) => {
  try {
    const response = await fetch(
      "https://portalsapi.quadropic.com/biometrics/rebuild",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.ok) {
      console.log("Passkey generated successfully", response.status);
      const { options } = await response.json();
      const authRes = await startRegistration({ ...options });

      try {
        await fetch("https://portalsapi.quadropic.com/biometrics/firstverify", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            cred: JSON.stringify(authRes),
          }),
        });
      } catch (error) {
        console.error("An error occurred");
      }
    } else {
      // Handle server-side errors
      if (response.status === 401) {
        setError(
          "There's something wrong in generated Passkey. Please try again."
        );
      } else {
        setError("There's something wrong. Please try again later.");
      }
    }
  } catch (error) {
    // Handle client-side errors
    setError("An error occurred. Please check your network connection.");
    console.error("An error occurred");
  }
};
