from langchain_community.llms import HuggingFaceEndpoint
from langchain.prompts import PromptTemplate
from langchain.output_parsers import StructuredOutputParser, ResponseSchema

import logging
import re


logger = logging.getLogger(__name__)


class LeadExtractor:
    """Service to extract lead information from unstructured text using LangChain with HuggingFace."""

    def __init__(self):
        # Initialize HuggingFace model
        self.llm = None
        self._initialize_llm_if_possible()

        # Define the output schema
        response_schemas = [
            ResponseSchema(name="name", description="The full name of the lead"),
            ResponseSchema(name="email", description="The email address of the lead"),
            ResponseSchema(
                name="company",
                description="The company name the lead is associated with",
            ),
        ]

        self.output_parser = StructuredOutputParser.from_response_schemas(
            response_schemas
        )
        self.format_instructions = self.output_parser.get_format_instructions()

        # Initialize prompt template
        self.template = """
        You are a smart AI assistant that extracts structured lead information from messages.
        
        Extract the following information from the text below:
        1. Full Name of the person
        2. Email Address
        3. Company Name
        
        If any information is missing, return "Unknown" for that field.
        
        {format_instructions}
        
        Text: {text}
        """

        self.prompt = PromptTemplate(
            template=self.template,
            input_variables=["text"],
            partial_variables={"format_instructions": self.format_instructions},
        )

    def _initialize_llm_if_possible(self):
        """Initialize the free HuggingFace model."""
        try:
            # Initialize with default HuggingFace model
            self.llm = HuggingFaceEndpoint(
                repo_id="google/flan-t5-base",  # Free model from HuggingFace
                temperature=0.1,
                max_length=1000,
                huggingfacehub_api_token=None,  # No token needed for most base models
            )
            logger.info("HuggingFace LLM initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize HuggingFace LLM: {e}")

    async def extract_lead_info(self, text: str) -> dict:
        """
        Extract lead information from the given text.

        Args:
            text: The message text to extract information from

        Returns:
            A dictionary with name, email, and company
        """
        if not self.llm:
            logger.warning("LLM not available, falling back to regex extraction")
            return self._extract_with_regex(text)

        try:
            # Generate the prompt
            _input = self.prompt.format_prompt(text=text)
            logger.info("Using free HuggingFace model for lead extraction")

            # Get the output from the LLM
            output = self.llm.predict(_input.to_string())

            # Parse the output
            structured_output = self.output_parser.parse(output)

            logger.info(f"Extracted lead info: {structured_output}")
            return structured_output

        except Exception as e:
            logger.error(f"LLM extraction error: {str(e)}")
            # Fall back to regex extraction
            return self._extract_with_regex(text)

    def _extract_with_regex(self, text: str) -> dict:
        """Extract information using regex as a fallback method"""
        # Basic name extraction - look for common name patterns
        name_match = re.search(
            r"(?:I\'m|I am|name is|this is)\s+([A-Z][a-z]+(?: [A-Z][a-z]+)+)",
            text,
        )
        name = name_match.group(1) if name_match else "Unknown"

        # Basic email extraction
        email_match = re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", text)
        email = email_match.group(0) if email_match else "unknown@example.com"

        # Basic company extraction
        company_match = re.search(
            r"(?:at|from|with|of|founder of|co-founder of)\s+([A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+)*)",
            text,
        )
        company = company_match.group(1) if company_match else "Unknown"

        extracted_info = {"name": name, "email": email, "company": company}

        logger.info(f"Regex-based extraction: {extracted_info}")
        return extracted_info
