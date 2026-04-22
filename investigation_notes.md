# Investigation Notes

- Project extracted to `/home/ubuntu/work_ibb_v22/ibb_project`.
- The sidebar is implemented in `src/components/layout/Sidebar.jsx`.
- Main sidebar container width is `w-72` (288px) when open.
- Navigation wrapper uses `px-3`, leaving an inner content width of roughly 264px.
- Submenu container uses `pl-4`, and submenu buttons still use `w-full`, which likely causes the visual active background/border to consume full parent width while also being visually offset by nested indentation.
- Both parent and leaf menu items use `overflow-hidden`, relative positioning, and active styles with background/border.
- Leaf item active state is applied on the button/link wrapper: `bg-primary/10 text-primary font-medium shadow-sm border border-primary/20`.
- There is also an absolutely positioned left active indicator: `absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full`.
- Because the submenu wrapper adds left padding and the child still expands to full width, the highlight can appear to overflow to the right even without expanding the overall sidebar.
- Likely fix direction: constrain menu item width with box sizing and remove width inflation caused by nested indentation; apply a dedicated width calculation for level 0 and nested items rather than widening the sidebar itself.
- Browser attempt on the dev server rendered a blank viewport, so the sidebar issue is being fixed from code inspection rather than visual confirmation.
