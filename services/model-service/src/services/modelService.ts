import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

const downloadModel = async (modelName: string): Promise<string> => {
  try {
    const { stdout } = await execPromise(`ollama pull ${modelName}`);
    return stdout;
  } catch (error) {
    throw new Error(`Failed to download model: ${error.message}`);
  }
};

export default { downloadModel };