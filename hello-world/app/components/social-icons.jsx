import Link from "next/link";
import { Github, Twitter, Linkedin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SocialIcons() {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="https://github.com/hello-world-crypto"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Github className="h-4 w-4" />
          <span className="sr-only">GitHub</span>
        </Button>
      </Link>
      <Link
        href="https://twitter.com/helloworldcrypto"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Twitter className="h-4 w-4" />
          <span className="sr-only">Twitter</span>
        </Button>
      </Link>
      <Link
        href="https://linkedin.com/company/hello-world-crypto"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Linkedin className="h-4 w-4" />
          <span className="sr-only">LinkedIn</span>
        </Button>
      </Link>
      <Link
        href="https://discord.gg/hello-world-crypto"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MessageCircle className="h-4 w-4" />
          <span className="sr-only">Discord</span>
        </Button>
      </Link>
    </div>
  );
}
