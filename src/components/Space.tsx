export const Space = ({ height = 0, width = 0 }) => {
    return (
        <div style={{ height: `${height}px`, width: `${width}px`, minHeight: `${height}px`, minWidth: `${width}px` }}></div>
    )
}