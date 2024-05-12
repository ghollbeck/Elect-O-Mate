import time
import json
from datetime import datetime

class Parameters:
    def __init__(self, type="object"):
        self.properties = {}
        self.required = []
        self.type = type

    def add_property(self, name, type, description=None, required=False):
        self.properties[name] = {
            "type": type,
            "description": description,
        }

        if required:
            self.required.append(name)

        return self

    def json(self):
        return {
            "type": self.type,
            "properties": self.properties,
            "required": self.required,
        }

class Thread:
    def __init__(self, client):
        self.client = client
        self.thread = self.client.beta.threads.create()
        self.id = self.thread.id
        self.run_id = None
        self.messages = []

    def create_assistant(self, name, instructions, model="gpt-3.5-turbo"):
        return Assistant(
            thread=self,
            name=name,
            instructions=instructions,
            model=model,
        )

    def user_say(self, query):
        return self.say("user", query)
    
    def system_say(self, query):
        return self.say("system", query)
    
    def say(self, role, query):
        self.messages.append(
            {
                "role": role,
                "content": query,
                "when": datetime.now(),
            }
        )

        return self.client.beta.threads.messages.create(
            thread_id=self.id,
            role=role,
            content=query,
        )
    
    def print_last_message(self):
        messages = self.client.beta.threads.messages.list(thread_id=self.id)
        for msg in messages:
            print(f"{msg.role}: {msg.content[0].text.value}")
            break

class Assistant:
    def __init__(self, thread, name, instructions, model="gpt-3.5-turbo"):
        self.name = name
        self.instructions = instructions
        self.client = thread.client
        
        self.tools = []
        self.tool_fns = {}

        self.model = model
        self.thread = thread

        self.assistant = None
        self.id = None

    def initialize(self):
        self.assistant = self.client.beta.assistants.create(
            name=self.name,
            instructions=self.instructions,
            tools=self._dump_tools(),
            model=self.model,
        )
        self.id = self.assistant.id

    def add_tool(self, *args, name=None, description=None, parameters=None, function=None, **kwargs):
        if len(args) == 1:
            tool = args[0]

        else:
            tool = {
                "name": name,
                "description": description,
                "parameters": parameters,
            }

        self.tools.append(tool)
        self.tool_fns[name] = function

    def _dump_tools(self):
        return [
            {
                "type": "function",
                "function": tool,
            }
            for tool in self.tools
        ]

    def complete(self):
        run = self.client.beta.threads.runs.create(
            thread_id=self.thread.id,
            assistant_id=self.assistant.id,
        )

        run = self._wait_for_run_completion(run.id)

        # multiple chained actions...
        while run.status == 'requires_action':
            run = self._submit_tool_outputs(run.id, run.required_action.submit_tool_outputs.tool_calls)
            run = self._wait_for_run_completion(run.id)

        messages = self.client.beta.threads.messages.list(thread_id=self.thread.id)
        for msg in messages:
            self.thread.messages.append(
                {
                    "role": msg.role,
                    "content": msg.content[0].text.value,
                    "when": datetime.now(),
                }
            )
            
            return msg.content[0].text.value


    def _wait_for_run_completion(self, run_id):
        while True:
            time.sleep(1)
            run = self.client.beta.threads.runs.retrieve(thread_id=self.thread.id, run_id=run_id)
            #print(f"Current run status: {run.status}")
            if run.status in ['completed', 'failed', 'requires_action']:
                return run
            
    def _submit_tool_outputs(self, run_id, tools_to_call):
        tool_output_array = []
        for tool in tools_to_call:
            output = None
            tool_call_id = tool.id
            function_name = tool.function.name
            function_args = tool.function.arguments

            print('Running tool', function_name, 'with args', function_args)
            fn = self.tool_fns[function_name]
            output = fn(**json.loads(function_args))

            if output:
                tool_output_array.append({"tool_call_id": tool_call_id, "output": output})

        return self.client.beta.threads.runs.submit_tool_outputs(
            thread_id=self.thread.id,
            run_id=run_id,
            tool_outputs=tool_output_array
        )