"use client";

import Spline from '@splinetool/react-spline';

import type { ComponentProps } from 'react';

export default function SplineWrapper(props: ComponentProps<typeof Spline>) {
  return <Spline {...props} />;
}
