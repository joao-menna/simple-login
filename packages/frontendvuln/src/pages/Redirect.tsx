import { useNavigate } from "react-router";
import { useEffectOnce } from "react-use";

export function RedirectPage() {
  const navigate = useNavigate();

  useEffectOnce(() => {
    navigate("/dashboard");
  });

  return <></>;
}
