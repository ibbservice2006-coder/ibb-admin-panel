// Generate SQL from visual query builder state
export const generateSQL = (queryState) => {
  const { tables, joins, selectedFields, whereConditions, groupBy, orderBy, limit } = queryState

  if (tables.length === 0) {
    return ''
  }

  let sql = 'SELECT '

  // SELECT clause
  if (selectedFields.length === 0) {
    sql += '*'
  } else {
    sql += selectedFields
      .map(field => `${field.table}.${field.name}${field.alias ? ` AS ${field.alias}` : ''}`)
      .join(', ')
  }

  // FROM clause
  sql += `\nFROM ${tables[0].name}`

  // JOIN clauses
  joins.forEach(join => {
    const joinType = join.type.toUpperCase().replace('-', ' ')
    sql += `\n${joinType} JOIN ${join.toTable}`
    sql += ` ON ${join.fromTable}.${join.fromField} = ${join.toTable}.${join.toField}`
  })

  // WHERE clause
  if (whereConditions.length > 0) {
    sql += '\nWHERE '
    sql += whereConditions
      .map((condition, index) => {
        const operator = condition.operator || '='
        const value = condition.value
        const formattedValue = typeof value === 'string' ? `'${value}'` : value
        
        let conditionStr = `${condition.table}.${condition.field} ${operator} ${formattedValue}`
        
        if (index > 0 && condition.logicalOperator) {
          conditionStr = `${condition.logicalOperator} ${conditionStr}`
        }
        
        return conditionStr
      })
      .join(' ')
  }

  // GROUP BY clause
  if (groupBy.length > 0) {
    sql += '\nGROUP BY '
    sql += groupBy.map(field => `${field.table}.${field.name}`).join(', ')
  }

  // ORDER BY clause
  if (orderBy.length > 0) {
    sql += '\nORDER BY '
    sql += orderBy
      .map(field => `${field.table}.${field.name} ${field.direction || 'ASC'}`)
      .join(', ')
  }

  // LIMIT clause
  if (limit) {
    sql += `\nLIMIT ${limit}`
  }

  return sql + ';'
}

// Parse field for aggregation
export const getAggregateFunction = (field) => {
  if (field.aggregate) {
    return `${field.aggregate.toUpperCase()}(${field.table}.${field.name})`
  }
  return `${field.table}.${field.name}`
}

// Validate query
export const validateQuery = (queryState) => {
  const errors = []

  if (queryState.tables.length === 0) {
    errors.push('At least one table must be selected')
  }

  if (queryState.joins.length > 0) {
    queryState.joins.forEach((join, index) => {
      if (!join.fromField || !join.toField) {
        errors.push(`Join ${index + 1} is missing field mappings`)
      }
    })
  }

  if (queryState.groupBy.length > 0 && queryState.selectedFields.length > 0) {
    // Check if all non-aggregate fields are in GROUP BY
    const nonAggregateFields = queryState.selectedFields.filter(f => !f.aggregate)
    const groupByFields = queryState.groupBy.map(f => `${f.table}.${f.name}`)
    
    nonAggregateFields.forEach(field => {
      const fieldKey = `${field.table}.${field.name}`
      if (!groupByFields.includes(fieldKey)) {
        errors.push(`Field ${fieldKey} must be in GROUP BY clause or use an aggregate function`)
      }
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
