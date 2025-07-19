import React from "react";
import { Button } from "~/components/ui/button";
import * as TablerIcons from "@tabler/icons-react";
import { Link } from "react-router";

interface ActionButtonsProps {
  onDownload: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onDownload }) => {
  return (
    <div className="mt-auto px-3 py-3 flex flex-col gap-3 bg-accent rounded-b-md">
      <Button className="w-full justify-start" onClick={onDownload}>
        <TablerIcons.IconDownload />
        Download Icon
      </Button>
      <Link to="https://github.com/tommerty/streamdeck-icons">
        <Button variant={"outline"} className="w-full justify-start">
          <TablerIcons.IconBrandGithub />
          GitHub
        </Button>
      </Link>
    </div>
  );
};

export default ActionButtons;
