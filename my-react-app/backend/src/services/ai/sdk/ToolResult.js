class ToolResult
{
    constructor({
        success=true,
        summary="",
        data=null,
        metadata={},
        ui=[],
        warnings=[],
        error=null
    })
    {
        this.success=success;
        this.summary=summary;
        this.data=data;
        this.metadata=metadata;
        this.ui=ui;
        this.warnings=warnings;
        this.error=error;
    }
    static success({
        summary,
        data=null,
        metadata={},
        ui=[],
        warnings=[]
    })
    {
        return new ToolResult({
            success:true,
            summary,
            data,
            metadata,
            ui,
            warnings
        });
    }
    static failure({
        summary,
        error,
        metadata={},
        ui=[],
        warnings=[]
    })
    {
        return new ToolResult({
            success:false,
            summary,
            error,
            metadata,
            ui,
            warnings
        });
    }
}

module.exports=ToolResult;