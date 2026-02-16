import { writeFile } from 'fs/promises';

async function writeRiskToFile(finalStatement, riskData) {
    const filename = `risk-${Date.now()}.txt`;
    
    // Using a template literal to build the file content
    const content = riskData 
        ? `${finalStatement}\n\n--- Raw JSON ---\n${JSON.stringify(riskData, null, 2)}` 
        : finalStatement;

    try {
        await writeFile(filename, content, 'utf8');
        return filename;
    } catch (err) {
        console.error("Error saving file:", err);
        throw err; 
    }
}

// Exporting at the end of the file
export default writeRiskToFile;