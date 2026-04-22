import { memo } from 'react'
import { getBezierPath, EdgeLabelRenderer } from 'reactflow'

const RelationshipEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  selected
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <path
        id={id}
        className={selected ? "stroke-primary" : "stroke-muted-foreground"}
        style={{
          strokeWidth: selected ? 3 : 2,
          fill: 'none',
          transition: 'all 0.2s'
        }}
        d={edgePath}
        markerEnd={markerEnd}
      />
      
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <div className={`
              px-2 py-1 rounded text-xs font-medium
              ${selected 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
              }
              border shadow-sm transition-all duration-200
            `}>
              {data.label}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
})

RelationshipEdge.displayName = 'RelationshipEdge'

export default RelationshipEdge
