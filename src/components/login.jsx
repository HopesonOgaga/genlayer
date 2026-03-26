import { useAuth } from "../context/authcontext";

export default function Login() {
  const auth = useAuth();

  console.log(auth); // 👈 check this

  return <div>Login</div>;
}