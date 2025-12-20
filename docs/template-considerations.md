# Template Data Model Considerations

This document outlines considerations and potential improvements for the work item template system based on the templates created.

## Current Data Model Support

The current data model supports:
- ✅ Hierarchical work item types via `allowed_children_type_ids`
- ✅ Multiple relationship types (parent/child, blocks, duplicates, etc.)
- ✅ Custom fields per work item type
- ✅ Statuses and priorities per work item type
- ✅ Assignment fields per work item type

## Considerations and Recommendations

### 1. Deep Hierarchies (7+ Levels)

**Issue**: Some templates (SAFe, PMBOK, PRINCE2) have 7 levels of hierarchy, which can be difficult to navigate.

**Current Solution**: All levels are implemented as work item types.

**Recommendation**: Consider UI improvements for deep hierarchies:
- Collapsible tree views
- Breadcrumb navigation
- Filtering by level
- Flat view with level indicators

### 2. Organizational Concepts

**Issue**: Some templates include organizational concepts like:
- Account (Architectural/Engineering, Legal, Marketing Agency)
- Client (Legal, Marketing Agency)
- Service (ITIL)
- Territory/Segment (Sales Ops)
- Product Line (Manufacturing)

**Current Solution**: These are implemented as work item types.

**Recommendation**: 
- If these entities don't need work items tracked within them, consider making them Project-level metadata or Workspace-level entities
- If they do need work items, keeping them as work item types is appropriate
- Consider adding a "container" flag to distinguish organizational containers from actual work items

### 3. Sequential Phases

**Issue**: Some templates have sequential phases (DMAIC, project phases) that are currently implemented as work item types.

**Examples**:
- Six Sigma: Define → Measure → Analyze → Improve → Control
- Construction: Pre-construction → Design → Procurement → Construction → Commissioning
- Legal: Discovery → Motions → Trial Prep → Trial

**Current Solution**: Phases are work item types, allowing work items within each phase.

**Alternative Approaches**:
1. **Status-based**: Use statuses instead of types (simpler but less flexible)
2. **Phase field**: Add a `phase` field to work items (requires schema changes)
3. **Current approach**: Keep as types (most flexible, allows phase-specific fields)

**Recommendation**: Keep current approach for flexibility, but consider:
- Phase gate validation (prevent moving to next phase until current is complete)
- Phase-specific workflows
- Phase timeline visualization

### 4. Multiple Parents

**Issue**: Some scenarios require multiple parents (e.g., Epic spanning multiple Sprints).

**Current Solution**: ✅ Supported via `work_item_relationships` table with multiple `parent` relationships.

**Status**: Already implemented and working.

### 5. Template Completeness

**Templates Created**:
- ✅ Scrum
- ✅ Kanban
- ✅ SAFe
- ✅ XP
- ✅ PMBOK
- ✅ PRINCE2
- ✅ Construction Project
- ✅ Architectural/Engineering
- ✅ Manufacturing Change Management
- ✅ Six Sigma
- ✅ Legal Firms
- ✅ Marketing Agency
- ✅ ITIL

**Templates Still Needed**:
- Lean Manufacturing
- Management Consulting
- Pharmaceutical R&D
- Scientific Research
- Hardware R&D
- Film Production
- Event Planning
- Government Projects
- Nonprofit Programs
- DevOps Pipelines
- Marketing Ops
- Sales Ops
- ERP Systems

### 6. Potential Schema Enhancements

Consider adding:

1. **Phase/Stage Field**: A separate field for sequential phases (alternative to phase types)
   ```rust
   pub phase: Option<String>, // e.g., "define", "measure", "analyze"
   ```

2. **Container Flag**: Distinguish organizational containers from work items
   ```rust
   pub is_container: bool, // true for Account, Client, Service, etc.
   ```

3. **Level Indicator**: Help with deep hierarchies
   ```rust
   pub hierarchy_level: Option<i32>, // 1 = top level, 2 = second level, etc.
   ```

4. **Template Metadata**: Store template-specific metadata
   ```rust
   pub template_metadata: Value, // JSON field for template-specific data
   ```

## Conclusion

The current data model is flexible enough to support all requested templates. The main considerations are:

1. **UI/UX**: Deep hierarchies need good navigation
2. **Organizational Concepts**: Consider if they should be Project/Workspace metadata
3. **Phases**: Current approach (types) is flexible but consider phase gates
4. **Multiple Parents**: ✅ Already supported

No schema changes are required to support the remaining templates.

