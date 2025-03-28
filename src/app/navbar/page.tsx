"use client"

import { Menu, MenuItem } from "@/components/ui/navbar-menu";
import { useState } from "react";

export default function Navbar() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-center justify-center m-4 bg-[#EF9651]" >
      {/* <Menu setActive={setActive}>
        <MenuItem item="ನವಾರ್ಣ ಮಂತ್ರ ಜಪ ಅಭಿಯಾನ" setActive={setActive} active={active}></MenuItem>
        <MenuItem item="Profile" setActive={setActive} active={active}></MenuItem>
      </Menu> */}
      <h1 className="text-2xl text-[#393E46] font-bold m-4">ನವಾರ್ಣ ಮಂತ್ರ ಜಪ ಅಭಿಯಾನ​</h1>
    </div>
  );
}