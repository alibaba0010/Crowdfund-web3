import { ConnectEmbed } from "thirdweb";
import { activeChain, clientId } from "../utils";

export default function Home() {
  return (
    <div>
      <ConnectEmbed client={clientId} chain={activeChain} />
    </div>
  );
}
