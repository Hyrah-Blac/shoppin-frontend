'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  .adm * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
  }

  .adm {
    min-height: 100vh;
    display: flex;
    background: #0f0e0d;
    font-family: 'DM Sans', system-ui, sans-serif;
    color: #f0ede9;
  }

  /* ── SIDEBAR ── */
  .adm-sidebar {
    position: fixed;
    top: 0; left: 0; bottom: 0;
    width: 68px;
    background: #161412;
    border-right: 1px solid rgba(255,255,255,.06);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 22px 0 26px;
    z-index: 100;
    transition: width .25s cubic-bezier(.4,0,.2,1);
    overflow: hidden;
    box-shadow: 4px 0 24px rgba(0,0,0,.4);
  }

  .adm-sidebar:hover, .adm-sidebar.expanded { width: 224px; }

  .adm-sidebar-logo {
    display: flex;
    align-items: center;
    gap: 11px;
    text-decoration: none;
    width: 100%;
    padding: 0 16px;
    height: 46px;
    margin-bottom: 32px;
    flex-shrink: 0;
    overflow: hidden;
  }

  .adm-logo-icon {
    width: 36px; height: 36px; min-width: 36px;
    background: linear-gradient(135deg, #e60023, #ff4458);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(230,0,35,.45);
    transition: transform .2s, box-shadow .2s;
    flex-shrink: 0;
  }

  .adm-sidebar-logo:hover .adm-logo-icon {
    transform: scale(1.1);
    box-shadow: 0 6px 22px rgba(230,0,35,.6);
  }

  .adm-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 700;
    color: #f0ede9;
    white-space: nowrap;
    opacity: 0;
    transition: opacity .18s;
    letter-spacing: -.3px;
  }

  .adm-sidebar:hover .adm-logo-text,
  .adm-sidebar.expanded .adm-logo-text { opacity: 1; }

  .adm-logo-text span { color: #e60023; }

  .adm-nav {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 10px;
    gap: 3px;
    flex: 1;
  }

  .adm-navlink {
    display: flex;
    align-items: center;
    gap: 13px;
    height: 46px;
    padding: 0 11px;
    border-radius: 14px;
    font-size: 13.5px;
    font-weight: 600;
    color: #6b6560;
    text-decoration: none;
    transition: background .18s, color .18s;
    overflow: hidden;
    white-space: nowrap;
  }

  .adm-navlink:hover {
    background: rgba(255,255,255,.05);
    color: #d4cfc9;
  }

  .adm-navlink.active {
    background: rgba(230,0,35,.14);
    color: #ff6b7a;
  }

  .adm-navlink-icon {
    min-width: 22px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .adm-navlink-label {
    opacity: 0;
    transition: opacity .18s;
  }

  .adm-sidebar:hover .adm-navlink-label,
  .adm-sidebar.expanded .adm-navlink-label { opacity: 1; }

  .adm-nav-divider {
    height: 1px;
    background: rgba(255,255,255,.06);
    margin: 10px 12px;
  }

  .adm-sidebar-bottom {
    width: 100%;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .adm-user-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 11px;
    border-radius: 14px;
    overflow: hidden;
    cursor: default;
  }

  .adm-avatar {
    width: 30px; height: 30px; min-width: 30px;
    border-radius: 50%;
    background: linear-gradient(135deg, #e60023, #ff4458);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800;
    color: #fff; letter-spacing: .3px;
    flex-shrink: 0;
    box-shadow: 0 2px 10px rgba(230,0,35,.35);
  }

  .adm-user-info {
    opacity: 0;
    transition: opacity .18s;
    overflow: hidden;
    white-space: nowrap;
  }

  .adm-sidebar:hover .adm-user-info,
  .adm-sidebar.expanded .adm-user-info { opacity: 1; }

  .adm-user-name {
    font-size: 13px; font-weight: 700;
    color: #d4cfc9;
    overflow: hidden; text-overflow: ellipsis;
  }

  .adm-user-role {
    font-size: 11px; color: #4a4540; font-weight: 500;
  }

  .adm-logout-btn {
    display: flex; align-items: center; gap: 13px;
    height: 46px; padding: 0 11px;
    border-radius: 14px;
    font-size: 13.5px; font-weight: 600;
    color: #4a4540;
    background: none; border: none;
    cursor: pointer; width: 100%;
    font-family: 'DM Sans', system-ui, sans-serif;
    overflow: hidden; white-space: nowrap;
    transition: background .18s, color .18s;
  }

  .adm-logout-btn:hover {
    background: rgba(230,0,35,.1);
    color: #e60023;
  }

  .adm-logout-icon {
    min-width: 22px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .adm-logout-label { opacity: 0; transition: opacity .18s; }

  .adm-sidebar:hover .adm-logout-label,
  .adm-sidebar.expanded .adm-logout-label { opacity: 1; }

  /* ── MAIN ── */
  .adm-main {
    margin-left: 68px;
    flex: 1; min-width: 0;
    padding: 52px 44px 88px;
  }

  /* ── HERO ── */
  .adm-hero {
    margin-bottom: 48px;
    animation: adm-fadeUp .5s ease both;
    position: relative;
  }

  .adm-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 10px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    color: #e60023;
    background: rgba(230,0,35,.1);
    border: 1px solid rgba(230,0,35,.2);
    border-radius: 999px;
    padding: 5px 14px;
    margin-bottom: 18px;
  }

  .adm-eyebrow-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #e60023;
    animation: adm-pulse 2s ease infinite;
    box-shadow: 0 0 6px #e60023;
  }

  @keyframes adm-pulse {
    0%,100% { opacity:1; transform:scale(1); box-shadow: 0 0 6px #e60023; }
    50%      { opacity:.5; transform:scale(.7); box-shadow: 0 0 2px #e60023; }
  }

  .adm-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px, 5vw, 58px);
    font-weight: 900;
    color: #f0ede9;
    letter-spacing: -1.5px;
    line-height: 1.02;
    margin-bottom: 12px;
  }

  .adm-title-accent {
    color: transparent;
    background: linear-gradient(135deg, #e60023, #ff6b7a);
    -webkit-background-clip: text;
    background-clip: text;
    font-style: italic;
  }

  .adm-subtitle {
    font-size: 15px; color: #4a4540;
    max-width: 420px; line-height: 1.7;
    font-weight: 400;
  }

  /* decorative line */
  .adm-hero::after {
    content: '';
    position: absolute;
    bottom: -24px; left: 0;
    width: 60px; height: 2px;
    background: linear-gradient(90deg, #e60023, transparent);
    border-radius: 999px;
  }

  /* ── STATS ── */
  .adm-stats {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    gap: 14px;
    margin-bottom: 56px;
  }

  .adm-stat {
    background: #161412;
    border: 1px solid rgba(255,255,255,.06);
    border-radius: 22px;
    padding: 24px 20px;
    position: relative;
    overflow: hidden;
    transition: transform .22s, border-color .22s, box-shadow .22s;
    animation: adm-fadeUp .5s ease both;
  }

  .adm-stat::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at top left, rgba(255,255,255,.03), transparent 60%);
    pointer-events: none;
  }

  .adm-stat:hover {
    transform: translateY(-4px);
    border-color: rgba(255,255,255,.12);
    box-shadow: 0 16px 40px rgba(0,0,0,.4);
  }

  .adm-stat-bar {
    position: absolute;
    top:0; left:0; right:0;
    height: 2px;
    border-radius: 22px 22px 0 0;
  }

  .adm-stat-glow {
    position: absolute;
    top: -20px; left: -20px;
    width: 80px; height: 80px;
    border-radius: 50%;
    opacity: .08;
    filter: blur(20px);
    pointer-events: none;
  }

  .adm-stat-icon {
    width: 42px; height: 42px;
    border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px;
    position: relative;
  }

  .adm-stat-label {
    font-size: 10px; font-weight: 700;
    letter-spacing: 1.2px; text-transform: uppercase;
    color: #3a3530; margin-bottom: 6px;
  }

  .adm-stat-value {
    font-family: 'Playfair Display', serif;
    font-size: clamp(22px, 2.5vw, 30px);
    font-weight: 700;
    color: #f0ede9;
    letter-spacing: -.5px;
    margin-bottom: 6px;
    line-height: 1;
  }

  .adm-stat-trend {
    font-size: 12px; font-weight: 600;
    display: flex; align-items: center; gap: 4px;
  }

  /* ── SECTION ── */
  .adm-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px; font-weight: 700;
    color: #f0ede9;
    letter-spacing: -.4px;
    margin-bottom: 22px;
  }

  /* ── PINS (masonry) ── */
  .adm-pins {
    columns: 3;
    column-gap: 16px;
    margin-bottom: 64px;
  }

  .adm-pin {
    break-inside: avoid;
    display: block;
    background: #161412;
    border: 1px solid rgba(255,255,255,.06);
    border-radius: 22px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    margin-bottom: 16px;
    transition: transform .22s, border-color .22s, box-shadow .22s;
    animation: adm-fadeUp .5s ease both;
    position: relative;
  }

  .adm-pin::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at top, rgba(255,255,255,.02), transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  .adm-pin:hover {
    transform: translateY(-5px);
    border-color: rgba(255,255,255,.12);
    box-shadow: 0 20px 50px rgba(0,0,0,.5);
  }

  .adm-pin-banner {
    height: 140px;
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
  }

  .adm-pin-banner.red    { background: linear-gradient(135deg, #1a0508, #3d0010, #1a0508); }
  .adm-pin-banner.purple { background: linear-gradient(135deg, #0e0a1f, #2d1a5e, #0e0a1f); }
  .adm-pin-banner.green  { background: linear-gradient(135deg, #041a10, #0a3d22, #041a10); }

  .adm-pin-banner-glow {
    position: absolute;
    inset: 0;
    opacity: .5;
  }

  .adm-pin-banner.red    .adm-pin-banner-glow { background: radial-gradient(ellipse at center, rgba(230,0,35,.3), transparent 65%); }
  .adm-pin-banner.purple .adm-pin-banner-glow { background: radial-gradient(ellipse at center, rgba(124,58,237,.3), transparent 65%); }
  .adm-pin-banner.green  .adm-pin-banner-glow { background: radial-gradient(ellipse at center, rgba(5,150,105,.3), transparent 65%); }

  .adm-pin-dots {
    position: absolute; inset: 0; opacity: .06;
    background-image: radial-gradient(circle, #fff 1px, transparent 1px);
    background-size: 18px 18px;
  }

  .adm-pin-icon-wrap {
    width: 58px; height: 58px;
    border-radius: 18px;
    background: rgba(255,255,255,.07);
    border: 1px solid rgba(255,255,255,.12);
    display: flex; align-items: center; justify-content: center;
    position: relative; z-index: 1;
    transition: transform .22s;
    backdrop-filter: blur(4px);
  }

  .adm-pin:hover .adm-pin-icon-wrap {
    transform: scale(1.12) rotate(-6deg);
  }

  .adm-pin-body { padding: 22px 20px 18px; position: relative; z-index: 1; }

  .adm-pin-tag {
    display: inline-block;
    font-size: 9px; font-weight: 700;
    letter-spacing: 1.2px; text-transform: uppercase;
    border-radius: 999px;
    padding: 3px 11px; margin-bottom: 10px;
  }

  .adm-pin-tag.red    { background: rgba(230,0,35,.12);   color: #ff6b7a; border: 1px solid rgba(230,0,35,.2); }
  .adm-pin-tag.purple { background: rgba(124,58,237,.12); color: #a78bfa; border: 1px solid rgba(124,58,237,.2); }
  .adm-pin-tag.green  { background: rgba(5,150,105,.12);  color: #34d399; border: 1px solid rgba(5,150,105,.2); }

  .adm-pin-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 700;
    color: #f0ede9; letter-spacing: -.3px; margin-bottom: 7px;
  }

  .adm-pin-desc {
    font-size: 13px; line-height: 1.65;
    color: #3a3530; margin-bottom: 18px;
  }

  .adm-pin-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 16px;
    border-top: 1px solid rgba(255,255,255,.05);
  }

  .adm-pin-meta-val {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700;
    color: #f0ede9; letter-spacing: -.3px; line-height: 1;
  }

  .adm-pin-meta-lbl {
    font-size: 10px; color: #3a3530;
    font-weight: 600; margin-top: 3px;
    letter-spacing: .5px; text-transform: uppercase;
  }

  .adm-pin-arrow {
    width: 34px; height: 34px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,.1);
    display: flex; align-items: center; justify-content: center;
    color: #3a3530;
    transition: all .2s;
    background: rgba(255,255,255,.03);
  }

  .adm-pin:hover .adm-pin-arrow {
    background: #e60023;
    border-color: #e60023;
    color: #fff;
    box-shadow: 0 4px 14px rgba(230,0,35,.4);
    transform: translateX(2px);
  }

  /* ── SKELETON ── */
  .adm-skel {
    background: linear-gradient(90deg, #1a1714 25%, #201d1a 50%, #1a1714 75%);
    background-size: 600px 100%;
    animation: adm-shimmer 1.6s infinite;
    border-radius: 22px;
  }

  @keyframes adm-shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }

  /* ── LOADING ── */
  .adm-loading {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: #0f0e0d;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .adm-loading-inner {
    display: flex; flex-direction: column;
    align-items: center; gap: 20px;
  }

  .adm-loading-logo {
    display: flex; align-items: center; gap: 11px;
  }

  .adm-loading-icon {
    width: 42px; height: 42px;
    background: linear-gradient(135deg, #e60023, #ff4458);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 20px rgba(230,0,35,.45);
  }

  .adm-loading-name {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700;
    color: #f0ede9; letter-spacing: -.3px;
  }

  .adm-loading-name span { color: #e60023; font-style: italic; }

  .adm-dots { display: flex; gap: 7px; }

  .adm-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #e60023; opacity: .3;
    animation: adm-dotpulse 1.2s ease infinite;
  }

  .adm-dot:nth-child(2) { animation-delay:.2s; }
  .adm-dot:nth-child(3) { animation-delay:.4s; }

  @keyframes adm-dotpulse {
    0%,100% { opacity:.3; transform:scale(1); }
    50%     { opacity:1;  transform:scale(1.4); box-shadow: 0 0 8px #e60023; }
  }

  /* ── MODAL ── */
  .adm-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,.6);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999; padding: 16px;
    animation: adm-overlayin .18s ease both;
  }

  @keyframes adm-overlayin {
    from { opacity:0; }
    to   { opacity:1; }
  }

  .adm-modal {
    background: #161412;
    border-radius: 26px;
    padding: 36px 30px 30px;
    width: 100%; max-width: 360px;
    text-align: center;
    border: 1px solid rgba(255,255,255,.08);
    box-shadow: 0 32px 80px rgba(0,0,0,.6);
    animation: adm-modalin .22s cubic-bezier(.22,.68,0,1.2) both;
  }

  @keyframes adm-modalin {
    from { opacity:0; transform:scale(.93) translateY(10px); }
    to   { opacity:1; transform:scale(1)   translateY(0); }
  }

  .adm-modal-icon {
    width: 54px; height: 54px; border-radius: 18px;
    background: rgba(230,0,35,.1);
    border: 1px solid rgba(230,0,35,.2);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 18px;
  }

  .adm-modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 700;
    color: #f0ede9; letter-spacing: -.3px; margin-bottom: 10px;
  }

  .adm-modal-desc {
    font-size: 14px; color: #4a4540;
    line-height: 1.6; margin-bottom: 26px;
  }

  .adm-modal-actions { display: flex; gap: 10px; }

  .adm-modal-cancel {
    flex: 1; height: 46px;
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 999px;
    font-size: 14px; font-weight: 600; color: #6b6560;
    cursor: pointer;
    transition: background .15s, color .15s;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .adm-modal-cancel:hover { background: rgba(255,255,255,.08); color: #d4cfc9; }

  .adm-modal-confirm {
    flex: 1; height: 46px;
    background: linear-gradient(135deg, #e60023, #ff4458);
    border: none; border-radius: 999px;
    font-size: 14px; font-weight: 700; color: #fff;
    cursor: pointer;
    box-shadow: 0 4px 18px rgba(230,0,35,.4);
    transition: opacity .15s, transform .12s;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  .adm-modal-confirm:hover  { opacity: .88; }
  .adm-modal-confirm:active { transform: scale(.98); }
  .adm-modal-confirm:disabled { opacity:.4; cursor:not-allowed; }

  /* ── KEYFRAMES ── */
  @keyframes adm-fadeUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .adm-stat:nth-child(1) { animation-delay:.06s; }
  .adm-stat:nth-child(2) { animation-delay:.12s; }
  .adm-stat:nth-child(3) { animation-delay:.18s; }
  .adm-stat:nth-child(4) { animation-delay:.24s; }
  .adm-pin:nth-child(1)  { animation-delay:.28s; }
  .adm-pin:nth-child(2)  { animation-delay:.34s; }
  .adm-pin:nth-child(3)  { animation-delay:.40s; }

  /* ── MOBILE ── */
  .adm-mobile-bar {
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0; height: 58px;
    background: #161412;
    border-bottom: 1px solid rgba(255,255,255,.06);
    align-items: center; justify-content: space-between;
    padding: 0 18px; z-index: 200;
    box-shadow: 0 4px 20px rgba(0,0,0,.4);
  }

  .adm-ham {
    width: 36px; height: 36px;
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 10px; background: rgba(255,255,255,.04);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #6b6560;
    transition: background .15s, color .15s;
  }

  .adm-ham:hover { background: rgba(255,255,255,.08); color: #d4cfc9; }

  .adm-drawer-overlay {
    display: none;
    position: fixed; inset: 0;
    background: rgba(0,0,0,.5);
    z-index: 300;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    animation: adm-overlayin .15s ease both;
  }

  .adm-drawer-overlay.open { display: block; }

  .adm-drawer {
    position: fixed;
    top:0; left:0; bottom:0; width: 248px;
    background: #161412;
    border-right: 1px solid rgba(255,255,255,.06);
    padding: 22px 0 26px;
    display: flex; flex-direction: column;
    z-index: 301;
    animation: adm-drawin .2s cubic-bezier(.22,.68,0,1.1) both;
    box-shadow: 8px 0 32px rgba(0,0,0,.5);
  }

  @keyframes adm-drawin {
    from { transform: translateX(-100%); }
    to   { transform: translateX(0); }
  }

  .adm-drawer-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 16px 18px;
    border-bottom: 1px solid rgba(255,255,255,.06);
    margin-bottom: 10px;
  }

  .adm-drawer-logo {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none;
  }

  .adm-drawer-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 17px; font-weight: 700;
    color: #f0ede9; letter-spacing: -.3px;
  }

  .adm-drawer-logo-text span { color: #e60023; font-style: italic; }

  .adm-drawer-close {
    width: 30px; height: 30px;
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 8px; background: rgba(255,255,255,.04);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #6b6560;
    transition: background .15s;
  }

  .adm-drawer-close:hover { background: rgba(255,255,255,.08); color: #d4cfc9; }

  .adm-drawer-nav {
    flex: 1; padding: 0 10px;
    display: flex; flex-direction: column; gap: 3px;
  }

  .adm-drawer-link {
    display: flex; align-items: center; gap: 12px;
    height: 46px; padding: 0 12px;
    border-radius: 14px;
    font-size: 14px; font-weight: 600;
    color: #6b6560; text-decoration: none;
    transition: background .15s, color .15s;
  }

  .adm-drawer-link:hover  { background: rgba(255,255,255,.05); color: #d4cfc9; }
  .adm-drawer-link.active { background: rgba(230,0,35,.12); color: #ff6b7a; }

  .adm-drawer-divider {
    height: 1px; background: rgba(255,255,255,.06);
    margin: 8px 10px;
  }

  .adm-drawer-bottom {
    padding: 0 10px;
    display: flex; flex-direction: column; gap: 3px;
  }

  .adm-drawer-user {
    display: flex; align-items: center; gap: 12px;
    padding: 8px 12px; border-radius: 14px;
  }

  .adm-drawer-logout {
    display: flex; align-items: center; gap: 12px;
    height: 46px; padding: 0 12px;
    border-radius: 14px;
    font-size: 14px; font-weight: 600; color: #e60023;
    background: rgba(230,0,35,.08);
    border: 1px solid rgba(230,0,35,.15);
    cursor: pointer; width: 100%;
    font-family: 'DM Sans', system-ui, sans-serif;
    transition: background .15s;
  }

  .adm-drawer-logout:hover { background: rgba(230,0,35,.15); }

  /* ── RESPONSIVE ── */
  @media (max-width: 1100px) {
    .adm-stats { grid-template-columns: repeat(2,1fr); }
    .adm-pins  { columns: 2; }
  }

  @media (max-width: 860px) {
    .adm-sidebar    { display: none; }
    .adm-mobile-bar { display: flex; }
    .adm-main       { margin-left: 0; padding-top: 82px; }
  }

  @media (max-width: 640px) {
    .adm-pins { columns: 1; }
    .adm-main { padding: 82px 18px 64px; }
  }

  @media (max-width: 480px) {
    .adm-stats { grid-template-columns: 1fr 1fr; gap: 10px; }
    .adm-stat  { padding: 18px 14px; border-radius: 18px; }
  }

  @media (hover: none) {
    .adm-stat:hover { transform: none; }
    .adm-pin:hover  { transform: none; }
    .adm-pin:active { transform: scale(.98); opacity: .9; }
  }

  @media (prefers-reduced-motion: reduce) {
    .adm *, .adm *::before, .adm *::after {
      animation-duration: .01ms !important;
      transition-duration: .01ms !important;
    }
  }

  @supports (padding: max(0px)) {
    .adm-sidebar { padding-bottom: max(26px, env(safe-area-inset-bottom)); }
    .adm-main {
      padding-left: max(44px, env(safe-area-inset-left));
      padding-right: max(44px, env(safe-area-inset-right));
    }
  }
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('adm-styles')) return;
  const s = document.createElement('style');
  s.id = 'adm-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

function BagIcon({ size = 17, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}

function LogoutIcon({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

const NAV_LINKS = [
  {
    href: '/admin', label: 'Dashboard',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  },
  {
    href: '/admin/products', label: 'Products',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  },
  {
    href: '/admin/orders', label: 'Orders',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  },
  {
    href: '/admin/users', label: 'Users',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
];

const STAT_CONFIG = [
  {
    key: 'revenue', label: 'Revenue', color: '#e60023', glow: '#e60023',
    iconBg: 'rgba(230,0,35,.1)',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#e60023" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  },
  {
    key: 'orders', label: 'Total Orders', color: '#7c3aed', glow: '#7c3aed',
    iconBg: 'rgba(124,58,237,.1)',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  },
  {
    key: 'products', label: 'Products', color: '#059669', glow: '#059669',
    iconBg: 'rgba(5,150,105,.1)',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  },
  {
    key: 'users', label: 'Users', color: '#d97706', glow: '#d97706',
    iconBg: 'rgba(217,119,6,.1)',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
];

const PINS = [
  {
    href: '/admin/products', color: 'red', tag: 'Catalogue', title: 'Products',
    desc: 'Create, edit, and manage your entire product catalog with ease.',
    metaKey: 'active listings', dataKey: 'products',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  },
  {
    href: '/admin/orders', color: 'purple', tag: 'Fulfilment', title: 'Orders',
    desc: 'Track shipments, update status, and manage customer orders.',
    metaKey: 'pending today', dataKey: 'pendingOrders',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  },
  {
    href: '/admin/users', color: 'green', tag: 'Community', title: 'Users',
    desc: 'Monitor user accounts and manage permissions effortlessly.',
    metaKey: 'registered users', dataKey: 'users',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
];

const StatSkel = () => <div className="adm-skel" style={{ height: 148 }} />;
const PinSkel  = () => <div className="adm-skel" style={{ height: 320, marginBottom: 16 }} />;

function getStatValue(stats, key) {
  return { revenue: stats?.revenue, orders: stats?.orders, products: stats?.products, users: stats?.users }[key] ?? '—';
}
function getStatTrend(stats, key) {
  return { revenue: stats?.revenueGrowth, orders: stats?.ordersGrowth, products: stats?.productsGrowth, users: stats?.usersGrowth }[key] ?? '—';
}
function getMetaValue(stats, dataKey) {
  return { products: stats?.products, pendingOrders: stats?.pendingOrders, users: stats?.users }[dataKey] ?? '—';
}
function getInitials(name) {
  if (!name) return 'A';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats]               = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showLogout, setShowLogout]     = useState(false);
  const [loggingOut, setLoggingOut]     = useState(false);
  const [drawer, setDrawer]             = useState(false);

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 860) setDrawer(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (!loading && user && user.role !== 'admin') router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    const fetchStats = async () => {
      try {
        const [pRes, oRes, uRes] = await Promise.all([
          api.get('/products'), api.get('/orders'), api.get('/users'),
        ]);
        const products = Array.isArray(pRes.data) ? pRes.data : pRes.data?.products || [];
        const orders   = Array.isArray(oRes.data) ? oRes.data : oRes.data?.orders   || [];
        const users    = Array.isArray(uRes.data) ? uRes.data : [];
        const revenue  = orders.reduce((s, o) => s + (o.totalAmount || o.total || 0), 0);
        const pending  = orders.filter(o => o.status === 'pending').length;
        setStats({
          revenue: `KSh ${(revenue / 1000).toFixed(1)}k`,
          orders: orders.length, products: products.length, users: users.length,
          pendingOrders: pending,
          revenueGrowth: '+12.4%',
          ordersGrowth: `+${orders.length > 0 ? Math.round((pending / orders.length) * 100) : 0}%`,
          productsGrowth: '+3 new', usersGrowth: '+5.3%',
        });
      } catch {
        setStats({ revenue: 'KSh 0k', orders: 0, products: 0, users: 0, pendingOrders: 0, revenueGrowth: '—', ordersGrowth: '—', productsGrowth: '—', usersGrowth: '—' });
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try { await logout(); router.push('/login'); }
    catch { setLoggingOut(false); setShowLogout(false); }
  };

  if (loading || !user) {
    return (
      <div className="adm-loading">
        <div className="adm-loading-inner">
          <div className="adm-loading-logo">
            <div className="adm-loading-icon"><BagIcon /></div>
            <span className="adm-loading-name">Shop<span>Pin</span></span>
          </div>
          <div className="adm-dots">
            <div className="adm-dot" /><div className="adm-dot" /><div className="adm-dot" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="adm">

      {/* ── SIDEBAR ── */}
      <aside className="adm-sidebar" aria-label="Admin navigation">
        <Link href="/admin" className="adm-sidebar-logo">
          <div className="adm-logo-icon"><BagIcon size={16} /></div>
          <span className="adm-logo-text">Shop<span>Pin</span></span>
        </Link>

        <nav className="adm-nav">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`adm-navlink${link.href === '/admin' ? ' active' : ''}`}
              title={link.label}
            >
              <span className="adm-navlink-icon">{link.icon}</span>
              <span className="adm-navlink-label">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="adm-nav-divider" />

        <div className="adm-sidebar-bottom">
          <div className="adm-user-row">
            <div className="adm-avatar">{getInitials(user?.name)}</div>
            <div className="adm-user-info">
              <div className="adm-user-name">{user?.name || 'Admin'}</div>
              <div className="adm-user-role">Administrator</div>
            </div>
          </div>
          <button className="adm-logout-btn" onClick={() => setShowLogout(true)} aria-label="Log out">
            <span className="adm-logout-icon"><LogoutIcon /></span>
            <span className="adm-logout-label">Log out</span>
          </button>
        </div>
      </aside>

      {/* ── MOBILE TOPBAR ── */}
      <div className="adm-mobile-bar">
        <button className="adm-ham" onClick={() => setDrawer(true)} aria-label="Open menu">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <Link href="/admin" style={{ display:'flex', alignItems:'center', gap:9, textDecoration:'none' }}>
          <div className="adm-logo-icon" style={{ width:30, height:30, borderRadius:'50%' }}><BagIcon size={14} /></div>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:'#f0ede9', letterSpacing:'-.3px' }}>Shop<span style={{ color:'#e60023', fontStyle:'italic' }}>Pin</span></span>
        </Link>
        <div className="adm-avatar" style={{ width:30, height:30, fontSize:11 }}>{getInitials(user?.name)}</div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {drawer && (
        <div
          className="adm-drawer-overlay open"
          onClick={(e) => { if (e.target === e.currentTarget) setDrawer(false); }}
          role="dialog" aria-modal="true"
        >
          <div className="adm-drawer">
            <div className="adm-drawer-head">
              <Link href="/admin" className="adm-drawer-logo" onClick={() => setDrawer(false)}>
                <div className="adm-logo-icon" style={{ width:30, height:30, borderRadius:'50%', minWidth:30 }}><BagIcon size={14} /></div>
                <span className="adm-drawer-logo-text">Shop<span>Pin</span></span>
              </Link>
              <button className="adm-drawer-close" onClick={() => setDrawer(false)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <nav className="adm-drawer-nav">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`adm-drawer-link${link.href === '/admin' ? ' active' : ''}`}
                  onClick={() => setDrawer(false)}
                >
                  {link.icon}{link.label}
                </Link>
              ))}
            </nav>
            <div className="adm-drawer-divider" />
            <div className="adm-drawer-bottom">
              <div className="adm-drawer-user">
                <div className="adm-avatar">{getInitials(user?.name)}</div>
                <div>
                  <div className="adm-user-name">{user?.name || 'Admin'}</div>
                  <div className="adm-user-role">Administrator</div>
                </div>
              </div>
              <button className="adm-drawer-logout" onClick={() => { setDrawer(false); setShowLogout(true); }}>
                <LogoutIcon color="#e60023" />Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN ── */}
      <main className="adm-main">

        {/* HERO */}
        <div className="adm-hero">
          <div className="adm-eyebrow">
            <span className="adm-eyebrow-dot" />
            Admin Dashboard
          </div>
          <h1 className="adm-title">
            Control <span className="adm-title-accent">Center</span>
          </h1>
          <p className="adm-subtitle">
            Monitor performance, manage inventory, and track orders from one place.
          </p>
        </div>

        {/* STATS */}
        <div className="adm-stats">
          {statsLoading
            ? STAT_CONFIG.map(s => <StatSkel key={s.key} />)
            : STAT_CONFIG.map(s => (
                <div key={s.key} className="adm-stat">
                  <div className="adm-stat-bar" style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
                  <div className="adm-stat-glow" style={{ background: s.glow }} />
                  <div className="adm-stat-icon" style={{ background: s.iconBg }}>{s.icon}</div>
                  <p className="adm-stat-label">{s.label}</p>
                  <p className="adm-stat-value">{getStatValue(stats, s.key)}</p>
                  <p className="adm-stat-trend" style={{ color: s.color }}>
                    <span>↑</span>{getStatTrend(stats, s.key)}
                  </p>
                </div>
              ))
          }
        </div>

        {/* QUICK ACCESS */}
        <h2 className="adm-section-title">Quick Access</h2>
        <div className="adm-pins">
          {statsLoading
            ? PINS.map((_, i) => <PinSkel key={i} />)
            : PINS.map(pin => (
                <Link key={pin.href} href={pin.href} className="adm-pin">
                  <div className={`adm-pin-banner ${pin.color}`}>
                    <div className="adm-pin-banner-glow" />
                    <div className="adm-pin-dots" />
                    <div className="adm-pin-icon-wrap">{pin.icon}</div>
                  </div>
                  <div className="adm-pin-body">
                    <span className={`adm-pin-tag ${pin.color}`}>{pin.tag}</span>
                    <h3 className="adm-pin-title">{pin.title}</h3>
                    <p className="adm-pin-desc">{pin.desc}</p>
                    <div className="adm-pin-footer">
                      <div>
                        <div className="adm-pin-meta-val">{getMetaValue(stats, pin.dataKey)}</div>
                        <div className="adm-pin-meta-lbl">{pin.metaKey}</div>
                      </div>
                      <div className="adm-pin-arrow"><ArrowIcon /></div>
                    </div>
                  </div>
                </Link>
              ))
          }
        </div>
      </main>

      {/* ── LOGOUT MODAL ── */}
      {showLogout && (
        <div
          className="adm-overlay"
          onClick={(e) => { if (e.target === e.currentTarget && !loggingOut) setShowLogout(false); }}
          role="dialog" aria-modal="true" aria-labelledby="logout-title"
        >
          <div className="adm-modal">
            <div className="adm-modal-icon">
              <LogoutIcon size={22} color="#e60023" />
            </div>
            <h2 className="adm-modal-title" id="logout-title">Log out?</h2>
            <p className="adm-modal-desc">
              You'll be signed out of your admin session and redirected to the login page.
            </p>
            <div className="adm-modal-actions">
              <button className="adm-modal-cancel" onClick={() => setShowLogout(false)} disabled={loggingOut}>
                Cancel
              </button>
              <button className="adm-modal-confirm" onClick={handleLogout} disabled={loggingOut}>
                {loggingOut ? 'Logging out…' : 'Yes, log out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}