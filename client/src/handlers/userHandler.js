import Cookies from "js-cookie";

// Register user data to MongoDb
export const registerUser = async (
  registerData,
  setErrorMessage,
  setSuccessMessage,
  setIsAuthenticated,
  tokenName,
  navigate
) => {
  try {
    // Send data for registration
    const response = await fetch("http://localhost:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    });
    // Handling data
    const data = await response.json();
    if (data.error) {
      setErrorMessage(data.error);
    } else if (data.success) {
      setSuccessMessage(data.success);
      setIsAuthenticated(true);
      Cookies.set(tokenName, JSON.stringify(data.token), { expires: 5 });
      navigate("/");
    } else {
      setErrorMessage("Something went wrong, Please try again");
    }
  } catch (error) {
    setErrorMessage("Something went wrong. Please try again.");
  }
};

// Get user data from DB and Login User
export const loginUser = async (
  loginData,
  setErrorMessage,
  setIsAuthenticated,
  tokenName,
  navigate
) => {
  try {
    // Send data for login
    const response = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    // Handling data
    const data = await response.json();
    if (data.error) {
      setErrorMessage(data.error);
    } else if (data.success) {
      setIsAuthenticated(true);
      Cookies.set(tokenName, JSON.stringify(data.success), { expires: 5 });
      navigate("/");
    } else {
      setErrorMessage("Something went wrong, Please try again");
    }
  } catch (error) {
    setErrorMessage("Something went wrong. Please try again.");
  }
};

// Logout User
export const logoutUser = (setIsAuthenticated, tokenName) => {
  Cookies.remove(tokenName);
  setIsAuthenticated(false);
  window.location.href = "/login";
};

// Update user Profile
export const updateUser = async (
  id,
  updatedData,
  tokenName,
  setErrorMessage,
  setSuccessMessage
) => {
  try {
    const response = await fetch(`http://localhost:8000/api/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();
    if (data.error) {
      setErrorMessage(data.error);
    }
    if (data.success) {
      setSuccessMessage(data.success);
      Cookies.remove(tokenName);
      Cookies.set(tokenName, JSON.stringify(data.user), { expires: 5 });
    } else {
      setErrorMessage("Something went wrong. Please try again.");
    }
  } catch (error) {
    setErrorMessage("Something went wrong. Please try again.");
  }
};

// Delete User
export const deleteUser = async (id, setErrorMessage, tokenName) => {
  try {
    // Alert user to confirm delete
    const confirmed = window.confirm(
      "Are you sure you want to delete account?"
    );
    if (!confirmed) {
      return;
    }
    // Send delete endpoint to server
    const response = await fetch(`http://localhost:8000/api/user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.success) {
      Cookies.remove(tokenName);
      window.location.href = "/login";
    } else if (data.error) {
      setErrorMessage(data.error);
    } else {
      setErrorMessage("Something went wrong. Please try again.");
    }
  } catch (error) {
    setErrorMessage("Something went wrong. Please try again.");
  }
};
