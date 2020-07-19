import React from "react";
import { observable } from "mobx"
import { MakeStateful } from "./state-maker";

export const {component: _nav, state: CurrentNavigation} = MakeStateful('navigation', {target: 'dashboard' }, {}, {}, () => {
  return <React.Fragment/>
})

export const Navigation = {
  navigate: (target: string) => {
    CurrentNavigation.nav.target = target;
  }
}